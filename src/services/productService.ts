import { Product, Category } from "@/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./mock/products";
import { db } from "./firebase/client";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

const isFirebaseReady = (): boolean => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(key && key !== "mock_api_key" && !key.includes("mock"));
};

/**
 * Fetches all categories. Uses Firestore if ready, otherwise falls back to MOCK_CATEGORIES.
 */
export async function getCategories(): Promise<Category[]> {
  if (isFirebaseReady()) {
    try {
      const snap = await getDocs(collection(db, "categories"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
      }
    } catch (error) {
      console.warn("Firestore getCategories fallback to mock:", error);
    }
  }
  return MOCK_CATEGORIES;
}

/**
 * Fetches products with optional category or featured filter.
 */
export async function getProducts(options: {
  categorySlug?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
} = {}): Promise<Product[]> {
  let products = [...MOCK_PRODUCTS];

  if (isFirebaseReady()) {
    try {
      let q = collection(db, "products");
      const constraints = [where("status", "==", "active")];
      const snap = await getDocs(query(q, ...constraints));
      if (!snap.empty) {
        products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      }
    } catch (error) {
      console.warn("Firestore getProducts fallback to mock:", error);
    }
  }

  // Filter by Category Slug
  if (options.categorySlug) {
    const category = MOCK_CATEGORIES.find((c) => c.slug === options.categorySlug);
    if (category) {
      products = products.filter((p) => p.categoryId === category.id);
    }
  }

  // Filter by Featured
  if (options.featuredOnly) {
    products = products.filter((p) => p.isFeatured);
  }

  // Search filter
  if (options.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return products;
}

/**
 * Fetches a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isFirebaseReady()) {
    try {
      const q = query(collection(db, "products"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
    } catch (error) {
      console.warn("Firestore getProductBySlug fallback to mock:", error);
    }
  }

  const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return found || null;
}
