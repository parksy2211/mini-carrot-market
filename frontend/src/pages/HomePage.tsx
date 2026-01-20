import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type Product = {
  id: number;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
};

const mockProducts: Product[] = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  title: `상품 ${i + 1}`,
  price: Math.floor(Math.random() * 90000) + 10000,
  location: "서울 • 방금 전",
  imageUrl: "",
}));

const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function HomePage() {
  const [sp] = useSearchParams();
  const q = (sp.get("q") ?? "").trim().toLowerCase();

  const products = useMemo(() => {
    if (!q) return mockProducts;
    return mockProducts.filter((p) => p.title.toLowerCase().includes(q));
  }, [q]);

  return (
    <section>
      <div className="pageHeader">
        <h1 className="pageTitle">상품</h1>
        <p className="pageDesc">{q ? `검색어: "${q}" • 결과 ${products.length}개` : "최신 상품 목록"}</p>
      </div>

      <div className="grid">
        {products.map((p) => (
          <article key={p.id} className="card">
            <div className="thumb">
              <div className="thumbInner">🖼️</div>
            </div>

            <div className="cardBody">
              <div className="cardTitle">{p.title}</div>
              <div className="cardPrice">{formatWon(p.price)}</div>
              <div className="cardMeta">{p.location}</div>
            </div>

            <button className="cardAction" type="button">
              상세보기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
