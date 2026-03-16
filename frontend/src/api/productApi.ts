import { apiFetch } from "./client";

export type Product = {
  itemId: number;
  title: string;
  price: number;
  sellerName: string;
};

type ItemPageResponse = {
  content: Product[];
  totalPages: number;
  number: number;
  last: boolean;
};

export async function fetchProducts(page = 0, size = 20): Promise<Product[]> {
  const response = await apiFetch<ItemPageResponse>(`/items?page=${page}&size=${size}`);
  return response.content;
}
