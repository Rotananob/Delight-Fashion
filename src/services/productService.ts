import { Product, Category } from "@/types";
import { db } from "./firebase/client";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mock/products";

/**
 * Fetches all categories from Firestore with reliable mock fallback.
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
    const q = collection(db, "products");
    const constraints = options.includeDrafts ? [] : [where("status", "==", "active")];
    const snap = await getDocs(query(q, ...constraints));
    
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
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const snap = await getDocs(q);
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
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product by ID from Firestore:", error);
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}


