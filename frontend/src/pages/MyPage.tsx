import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, type Product } from "../api/productApi";
import { clearTokens, getAccessToken } from "../auth/tokenStore";

type TokenPayload = {
  sub?: string;
  email?: string;
  exp?: number;
};

const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;

function parseJwtPayload(token: string | null): TokenPayload | null {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

export default function MyPage() {
  const nav = useNavigate();
  const token = getAccessToken();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tokenPayload = useMemo(() => parseJwtPayload(token), [token]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(0, 40);
        if (!cancelled) {
          setItems(data);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "마이페이지 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const myItems = useMemo(() => {
    // 백엔드에 "내 상품" 전용 API가 아직 없어서, 사용자 식별값(email local-part)과 판매자명을 느슨하게 매칭.
    const sellerKey = tokenPayload?.email?.split("@")[0]?.toLowerCase() ?? "";
    if (!sellerKey) return [];

    return items.filter((item) => item.sellerName.toLowerCase().includes(sellerKey));
  }, [items, tokenPayload?.email]);

  const totalPrice = useMemo(() => myItems.reduce((sum, item) => sum + item.price, 0), [myItems]);

  const handleLogout = () => {
    clearTokens();
    nav("/login");
  };

  if (!token) {
    return (
      <section>
        <div className="pageHeader">
          <h1 className="pageTitle">마이페이지</h1>
          <p className="pageDesc">로그인 후 내 프로필과 판매 내역을 확인해보세요.</p>
        </div>

        <div className="mypageLoginPanel">
          <h2>로그인이 필요해요</h2>
          <p>현재 백엔드는 JWT 기반 인증을 사용하므로 로그인 토큰이 있어야 마이페이지를 완성해서 볼 수 있어요.</p>
          <button type="button" className="primaryBtn" onClick={() => nav("/login")}>로그인 하러가기</button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="pageHeader">
        <h1 className="pageTitle">마이페이지</h1>
        <p className="pageDesc">백엔드 JWT/상품 API 기준으로 프로필 + 내 판매글 요약을 구성했어요.</p>
      </div>

      <div className="profileCard">
        <div>
          <div className="profileLabel">이메일</div>
          <div className="profileValue">{tokenPayload?.email ?? "확인 불가"}</div>
        </div>
        <div>
          <div className="profileLabel">회원 ID (토큰 sub)</div>
          <div className="profileValue">{tokenPayload?.sub ?? "확인 불가"}</div>
        </div>
        <button type="button" className="ghostBtn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <div className="statsGrid">
        <article className="statCard">
          <div className="statLabel">내 판매글 수</div>
          <div className="statValue">{myItems.length}개</div>
        </article>
        <article className="statCard">
          <div className="statLabel">판매 금액 합계</div>
          <div className="statValue">{formatWon(totalPrice)}</div>
        </article>
        <article className="statCard">
          <div className="statLabel">전체 상품 데이터</div>
          <div className="statValue">{items.length}개</div>
        </article>
      </div>

      <section className="myItemsSection">
        <h2 className="myItemsTitle">내 판매글</h2>
        <p className="myItemsDesc">* 현재 백엔드에 내 상품 전용 API가 없어 판매자명 기준으로 매칭해 보여줍니다.</p>

        {loading && <div className="emptyHint">상품 정보를 불러오는 중...</div>}
        {!loading && error && <div className="errorBox">{error}</div>}
        {!loading && !error && myItems.length === 0 && (
          <div className="emptyHint">등록한 상품이 아직 없거나 판매자 식별이 일치하지 않아요.</div>
        )}

        {!loading && !error && myItems.length > 0 && (
          <ul className="myItemList">
            {myItems.map((item) => (
              <li key={item.itemId} className="myItemRow">
                <div>
                  <strong>{item.title}</strong>
                  <div className="myItemMeta">판매자: {item.sellerName}</div>
                </div>
                <span className="myItemPrice">{formatWon(item.price)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
