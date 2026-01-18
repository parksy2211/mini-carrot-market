export type Product = {
  id: number;
  name: string;
  price: number;
  seller: string;
  description: string;
};

// Simple mock: generate products on the fly
export async function fetchProducts(page = 1, limit = 10): Promise<{ items: Product[]; hasMore: boolean }>{
  // simulate network delay
  await new Promise((r) => setTimeout(r, 400));

  const start = (page - 1) * limit + 1;
  const items: Product[] = Array.from({ length: limit }, (_, i) => {
    const id = start + i;
    return {
      id,
      name: `상품 ${id}`,
      price: Math.floor(1000 + Math.random() * 100000),
      seller: `판매자 ${((id - 1) % 10) + 1}`,
      description: `이 상품은 샘플 설명입니다. 상품 번호: ${id}. 더 많은 정보가 여기에 표시됩니다.`,
    };
  });

  // For demo, stop after 50 items
  const total = 50;
  const hasMore = start + limit - 1 < total;

  return { items: items.filter((_, idx) => start + idx <= total), hasMore };
}
