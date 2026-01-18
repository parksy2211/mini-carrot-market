import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 84 }}>
      <TopBar onSearch={(q) => setSearchQuery(q ?? "")} />

      <main style={{ paddingTop: 12 }}>
        <Outlet context={{ searchQuery }} />
      </main>

      <BottomNav />
    </div>
  );
}
