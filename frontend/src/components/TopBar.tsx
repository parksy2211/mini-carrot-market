import { FormEvent, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function TopBar() {
  const nav = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 홈에서만 검색 반영하려고 querystring으로 이동
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    nav(`/${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // 홈이 아닐 때도 검색창은 보이되, 검색하면 홈으로 이동하게 함
  const isHome = location.pathname === "/";

  return (
    <header className="topbar">
      <div className="topbarInner">
        <div className="brand" onClick={() => nav("/")}>
          <span className="brandLogo">🥕</span>
          <span className="brandText">Mini Carrot</span>
        </div>

        <form className="search" onSubmit={onSubmit}>
          <input
            className="searchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isHome ? "상품 검색" : "검색하면 홈으로 이동"}
          />
          <button className="searchBtn" type="submit">
            검색
          </button>
        </form>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `navBtn ${isActive ? "active" : ""}`}>
            홈
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `navBtn ${isActive ? "active" : ""}`}>
            채팅
          </NavLink>
          <NavLink to="/me" className={({ isActive }) => `navBtn ${isActive ? "active" : ""}`}>
            마이
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
