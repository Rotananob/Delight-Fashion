"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { OrderItem } from "@/types";

export interface PlaceOrderInput {
  items: OrderItem[];
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentMethod: "cod" | "aba_qr";
  shippingFee: number;
  totalAmount: number; // For validation
}

export async function placeOrderAction(input: PlaceOrderInput) {
  try {
    const session = await getSessionServer();
    const customerId = session?.uid || "guest";
    
    // Calculate total to prevent client-side tampering
    const calculatedSubtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculatedTotal = calculatedSubtotal + input.shippingFee;
    
    if (Math.abs(calculatedTotal - input.totalAmount) > 0.01) {
      throw new Error("Price mismatch detected. Please refresh your cart.");
    }

    const orderRef = adminDb.collection("orders").doc();
    const orderId = orderRef.id;
    const shortCode = orderId.substring(orderId.length - 6).toUpperCase();

    // Use Firestore Transaction to atomically check and deduct stock
    await adminDb.runTransaction(async (transaction) => {
      // 1. Read all required product documents first (Transaction Requirement)
      const productRefs = input.items.map(item => adminDb.collection("products").doc(item.productId));
      const productDocs = await transaction.getAll(...productRefs);
      
      const stockUpdates = new Map();

      // 2. Validate Stock
      for (let i = 0; i < input.items.length; i++) {
        const item = input.items[i];
        const doc = productDocs[i];
        
        if (!doc.exists) {
          throw new Error(`Product ${item.title} no longer exists.`);
        }
        
        const productData = doc.data() as any;
        const variantKey = `${item.size}-${item.color}`;
        const variant = productData.variants[variantKey];
        
        if (!variant) {
          throw new Error(`Variant ${variantKey} not found for ${item.title}.`);
        }
        
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.title} (${variantKey}). Only ${variant.stock} left.`);
        }
        
        // Track the updates we need to make
        const currentVariants = stockUpdates.get(doc.ref) || { ...productData.variants };
        currentVariants[variantKey].stock -= item.quantity;
        
        stockUpdates.set(doc.ref, {
          variants: currentVariants,
          totalStock: productData.totalStock - item.quantity,
          updatedAt: new Date().toISOString()
        });
      }

      // 3. Write Stock Deductions
      for (const [ref, updateData] of stockUpdates.entries()) {
        transaction.update(ref, updateData);
      }

      // 4. Create the Order Document
      transaction.set(orderRef, {
        id: orderId,
        orderCode: `DF-${shortCode}`,
        customerId,
        items: input.items,
        customerInfo: input.customerInfo,
        paymentMethod: input.paymentMethod,
        shippingFee: input.shippingFee,
        subtotal: calculatedSubtotal,
        totalAmount: calculatedTotal,
        status: "pending", // pending, processing, shipped, completed, cancelled
        paymentStatus: input.paymentMethod === "cod" ? "unpaid" : "awaiting_verification",
        createdAt: new Date().toISOString(),
      });
    });

    // Fire & Forget Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_SHOP_OWNER_CHAT_ID;
    
    if (botToken && chatId) {
      const message = `🛍 *NEW ORDER #${shortCode}*\n\n` +
        `👤 *Customer:* ${input.customerInfo.fullName}\n` +
        `📞 *Phone:* ${input.customerInfo.phone}\n` +
        `📍 *Address:* ${input.customerInfo.address}\n\n` +
        `💰 *Total:* $${calculatedTotal.toFixed(2)}\n` +
        `💳 *Payment:* ${input.paymentMethod.toUpperCase()}\n\n` +
        `📦 *Items:*\n` + input.items.map(i => `- ${i.quantity}x ${i.title} (${i.size} - ${i.color})`).join('\n');

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      }).catch(err => console.error('Telegram Notify Error:', err));
    }

    // We don't revalidate paths here instantly because the checkout modal handles success UI
    // and the cart will be cleared on the client side.

    return { 
      success: true, 
      orderId, 
      orderCode: `DF-${shortCode}` 
    };
    
  } catch (error: any) {
    console.error("Order Placement Transaction Error:", error);
    return { success: false, error: error.message || "Failed to place order." };
  }
}
