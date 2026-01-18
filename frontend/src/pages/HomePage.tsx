import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDetail from "../components/ProductDetail";
import { fetchProducts, type Product } from "../api/productApi";
import BottomNav from "../components/BottomNav";

export default function HomePage() {
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // reset and load first page whenever search changes
    setItems([]);
    setPage(1);
    setHasMore(true);
    load(1, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && hasMore) {
            load(page + 1, searchQuery);
          }
        });
      },
      { root: null, rootMargin: "200px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, loading, hasMore, page, searchQuery]);

  async function load(nextPage: number, query?: string) {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchProducts(nextPage, 10);
      const itemsToAdd = query && query.trim() ? res.items.filter((it) => it.name.includes(query)) : res.items;
      setItems((s) => [...s, ...itemsToAdd]);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ padding: 12 }}>
        <h2>판매 상품</h2>
        <div style={{ marginTop: 12 }}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} onClick={setSelected} />
          ))}
          {items.length === 0 && !loading && <p>상품이 없습니다.</p>}

          <div ref={sentinelRef} style={{ height: 1 }} />

          {loading && <p style={{ textAlign: "center" }}>로딩중…</p>}
          {!hasMore && <p style={{ textAlign: "center" }}>모든 상품을 불러왔습니다.</p>}
        </div>
      </div>

      <BottomNav />

      <ProductDetail product={selected} onClose={() => setSelected(null)} />
    </div>
  );
} 