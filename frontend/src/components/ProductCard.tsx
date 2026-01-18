import React from "react";
import type { Product } from "../api/productApi";

export default function ProductCard({ product, onClick }: { product: Product; onClick: (p: Product) => void }) {
  return (
    <article style={styles.card} onClick={() => onClick(product)}>
      <div style={styles.thumb}>🖼️</div>
      <div style={styles.body}>
        <div style={styles.title}>{product.name}</div>
        <div style={styles.price}>{product.price.toLocaleString()}원</div>
      </div>
    </article>
  );
}

const styles = {
  card: {
    display: "flex",
    gap: 12,
    padding: 12,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
  },
  thumb: {
    width: 72,
    height: 72,
    background: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    fontSize: 32,
  },
  body: { flex: 1 },
  title: { fontSize: 16, marginBottom: 6 },
  price: { color: "#ffdd57", fontWeight: 700 },
};
