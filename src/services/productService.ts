import { Product, Category } from "@/types";
import { db } from "./firebase/client";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

/**
 * Fetches all categories strictly from Firestore.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, "categories"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
    }
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
  }
  return [];
}

/**
 * Fetches products from Firestore with optional category, featured, or search filter.
 */
export async function getProducts(options: {
  categorySlug?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
} = {}): Promise<Product[]> {
  let products: Product[] = [];

  try {
    let q = collection(db, "products");
    const constraints = [where("status", "==", "active")];
    const snap = await getDocs(query(q, ...constraints));
    
    if (!snap.empty) {
      products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    }
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }

  // Filter by Category Slug (Requires fetching categories first to get the ID)
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
 * Fetches a single product by slug from Firestore.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(collection(db, "products"), where("slug", "==", slug), where("status", "==", "active"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product by slug from Firestore:", error);
  }
  return null;
}

/**
 * Fetches a single product by ID from Firestore.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product by ID from Firestore:", error);
  }
  return null;
}

