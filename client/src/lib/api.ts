// client/src/lib/api.ts

import { apiRequest } from "./queryClient";
import type { Collection, Product, InsertInquiry } from "@shared/schema";

export const api = {
  // 📦 Collections
  collections: {
    getAll: (): Promise<Collection[]> =>
      fetch("/api/collection").then((res) => res.json()).then(res => res.data || []),

    getFeatured: (): Promise<Collection[]> =>
      fetch("/api/collection?isFeatured=true").then((res) => res.json()).then(res => res.data || []),

    getByCategory: (category: string): Promise<Collection[]> =>
      fetch(`/api/collection?category=${category}`).then((res) => res.json()).then(res => res.data || []),

    getBySlug: (slug: string): Promise<Collection> =>
      fetch(`/api/collection/slug/${slug}`).then((res) => res.json()).then(res => res.data),
  },

  // 🛒 Products
  products: {
    getAll: (): Promise<Product[]> =>
      fetch("/api/product").then((res) => res.json()).then(res => res.data || []),

    getFeatured: (): Promise<Product[]> =>
      fetch("/api/product?isFeatured=true").then((res) => res.json()).then(res => res.data || []),

    getByCollection: (collectionId: number): Promise<Product[]> =>
      fetch(`/api/product?collection=${collectionId}`).then((res) => res.json()).then(res => res.data || []),

    getBySlug: (slug: string): Promise<Product> =>
      fetch(`/api/product/slug/${slug}`).then((res) => res.json()).then(res => res.data),
  },

  // ✉️ Inquiries
  inquiries: {
    create: async (inquiry: InsertInquiry) => {
      const response = await apiRequest("POST", "/api/inquiries", inquiry);
      return response.json();
    },
  },
};