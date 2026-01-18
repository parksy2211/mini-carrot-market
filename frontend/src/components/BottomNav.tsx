import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const loc = useLocation();
  return (
    <nav style={styles.nav}>
      <NavButton to="/" active={loc.pathname === "/"}>🏠<br/>홈</NavButton>
      <NavButton to="/chat" active={loc.pathname === "/chat"}>💬<br/>채팅</NavButton>
      <NavButton to="/mypage" active={loc.pathname === "/mypage"}>👤<br/>마이</NavButton>
    </nav>
  );
}

function NavButton({ to, children, active }: { to: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link to={to} style={{ textDecoration: "none", color: active ? "#646cff" : "inherit" }}>
      <div style={styles.btn}>{children}</div>
    </Link>
  );
}

const styles = {
  nav: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "var(--bg, #121212)",
  },
  btn: { textAlign: "center" as const, fontSize: 14 },
} as const;
