"use client";
import { useState } from "react";
import "./QuantitySelector.css";
import { Minus, Plus } from "@phosphor-icons/react";
export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);
  const increase = () => {
    setQuantity(quantity + 1);
  };
  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <div className="quantity-card">
      <div className="quantity-text">
        <h3>Cantidad</h3>
        <p>¿Cuántas quieres pedir?</p>
      </div>
      <div className="quantity-controls">
        <button className="quantity-btn secondary" onClick={decrease}>
          <Minus size={20} />
        </button>
        <span className="quantity-number">{quantity}</span>
        <button className="quantity-btn primary" onClick={increase}>
          <Plus size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}
