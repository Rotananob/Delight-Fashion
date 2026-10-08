// ==============================================================================
// DELIGHT FASHION - CORE DOMAIN TYPE DEFINITIONS (src/types/index.ts)
// ==============================================================================

export type UserRole = "customer" | "admin";

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  district?: string;
  city: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  savedAddresses?: UserAddress[];
  createdAt?: string;
}

export interface ProductVariant {
  size: "S" | "M" | "L" | "XL" | "XXL";
  color: string;
  colorHex?: string;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: ProductImage[];
  variants: Record<string, ProductVariant>;
  totalStock: number;
  availableSizes: string[];
  availableColors: string[];
  searchKeywords?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  status: "active" | "draft";
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  orderIndex: number;
  isActive: boolean;
}

export type OrderStatus = "Pending" | "Confirmed" | "Shipping" | "Completed" | "Cancelled";
export type PaymentMethod = "COD" | "ABA_QR";

export interface OrderItem {
  productId: string;
  title: string;
  variantKey: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderCode?: string;
  customerId: string;
  customerEmail: string;
  shippingAddress: UserAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: "unpaid" | "awaiting_verification" | "awaiting_payment" | "paid";
  paymentDetails?: {
    tranId: string;
    qrString: string;
    qrDataUrl?: string;
    deeplinks?: {
      aba: string;
      wing: string;
      acleda: string;
      bakong: string;
    };
    amount: number;
    currency: "USD" | "KHR";
    isTestMode?: boolean;
    status: string;
    createdAt?: string;
    settledAt?: string;
  };
  paymentReference?: string;
  status: OrderStatus;
  statusHistory?: OrderStatusHistoryItem[];
  telegramNotified?: boolean;
  createdAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt?: string;
}
