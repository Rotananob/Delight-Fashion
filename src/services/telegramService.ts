import { adminDb } from "./firebase/admin";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_SHOP_OWNER_CHAT_ID;

const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Helper to fetch topic ID from Firebase or create it if missing
async function getOrCreateTopicId(topicName: string): Promise<number | undefined> {
  if (!BOT_TOKEN || !CHAT_ID) return undefined;

  try {
    const docRef = adminDb.collection("settings").doc("telegram_topics");
    const docSnap = await docRef.get();
    let topics: Record<string, number> = {};

    if (docSnap.exists) {
      topics = docSnap.data() || {};
      if (topics[topicName]) {
        return topics[topicName];
      }
    }

    // Topic doesn't exist, try to create it via Telegram API
    const res = await fetch(`${TELEGRAM_API_URL}/createForumTopic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        name: topicName,
      }),
    });

    const data = await res.json();

    if (data.ok && data.result.message_thread_id) {
      const newThreadId = data.result.message_thread_id;
      // Save to Firebase for future use
      await docRef.set({ [topicName]: newThreadId }, { merge: true });
      return newThreadId;
    } else {
      console.warn(`Failed to create Telegram topic '${topicName}':`, data.description);
      return undefined;
    }
  } catch (error) {
    console.error(`Error managing Telegram topic '${topicName}':`, error);
    return undefined;
  }
}

export async function sendTelegramAlert(topicName: "Orders" | "Users" | "Bookings", message: string) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram credentials missing in environment variables.");
    return;
  }

  try {
    // Attempt to get or create the topic thread ID
    const threadId = await getOrCreateTopicId(topicName);

    const payload: any = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
    };

    if (threadId) {
      payload.message_thread_id = threadId;
    }

    const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("Failed to send Telegram message:", data.description);
    }
  } catch (error) {
    console.error("Error sending Telegram alert:", error);
  }
}
