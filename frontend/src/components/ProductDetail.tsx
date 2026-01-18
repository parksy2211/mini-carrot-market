import React from "react";
import type { Product } from "../api/productApi";

export default function ProductDetail({ product, onClose }: { product: Product | null; onClose: () => void }) {
  if (!product) return null;
  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={styles.sheet}>
        <button onClick={onClose} style={styles.close}>닫기</button>
        <h3>{product.name}</h3>
        <p style={{ fontWeight: 700 }}>{product.price.toLocaleString()}원</p>
        <p><strong>판매자:</strong> {product.seller}</p>
        <hr />
        <p>{product.description}</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    background: "rgba(0,0,0,0.5)",
    zIndex: 50,
  },
  sheet: {
    width: "100%",
    maxWidth: 720,
    background: "#111",
    color: "white",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  close: { marginBottom: 8 },
};
