import React, { useEffect, useRef, useState } from "react";

export default function TopBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQ("");
    }
  }, [open]);

  function submit() {
    onSearch?.(q.trim());
  }

  function clearAndClose() {
    setQ("");
    onSearch?.("");
    setOpen(false);
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {!open ? (
          <>
            🍊 <strong>Mini Carrot</strong>
          </>
        ) : (
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") clearAndClose();
            }}
            placeholder="상품을 검색하세요"
            style={styles.input}
          />
        )}
      </div>
      <div style={styles.right}>
        <button
          aria-label="search"
          style={styles.iconBtn}
          onClick={() => {
            if (!open) setOpen(true);
            else {
              submit();
            }
          }}
        >
          🔍
        </button>
        {open ? (
          <button aria-label="close" style={styles.iconBtn} onClick={clearAndClose}>
            ✖
          </button>
        ) : (
          <>
            <button aria-label="notifications" style={styles.iconBtn}>🔔</button>
            <button aria-label="more" style={styles.iconBtn}>☰</button>
          </>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky" as const,
    top: 0,
    background: "var(--bg, transparent)",
    zIndex: 10,
  },
  left: { fontSize: 18 },
  right: { display: "flex", gap: 8 },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: "inherit",
    fontSize: 18,
    cursor: "pointer",
  },
  input: {
    width: 280,
    maxWidth: "60vw",
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "transparent",
    color: "inherit",
    fontSize: 15,
  },
};
