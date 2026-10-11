import "server-only";
import { Product, Category } from "@/types";
import { adminDb } from "./firebase/admin";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mock/products";

/**
 * Fetches all categories from Firestore with reliable mock fallback.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await adminDb.collection("categories").orderBy("orderIndex", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
    }
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
  }
  return MOCK_CATEGORIES;
}

/**
 * Fetches products from Firestore with optional category, featured, draft, or search filter.
 */
export async function getProducts(options: {
  categorySlug?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
  includeDrafts?: boolean;
} = {}): Promise<Product[]> {
  let products: Product[] = [];

  try {
    let queryRef = adminDb.collection("products") as FirebaseFirestore.Query;
    if (!options.includeDrafts) {
      queryRef = queryRef.where("status", "==", "active");
    }
    const snap = await queryRef.get();
    
    if (!snap.empty) {
      products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    }
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
  }

  // Fallback to MOCK_PRODUCTS if Firestore returned nothing
  if (products.length === 0) {
    products = options.includeDrafts
      ? [...MOCK_PRODUCTS]
      : MOCK_PRODUCTS.filter((p) => p.status === "active");
  }

  // Filter by Category Slug
  if (options.categorySlug) {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === options.categorySlug);
    if (category) {
      products = products.filter((p) => p.categoryId === category.id);
    } else {
      return []; // Category not found
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
 * Fetches a single product by slug from Firestore with fallback.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const snap = await adminDb.collection("products").where("slug", "==", slug).limit(1).get();
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product by slug from Firestore:", error);
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
}

/**
 * Fetches a single product by ID from Firestore with fallback.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await adminDb.collection("products").doc(id).get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product by ID from Firestore:", error);
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}


