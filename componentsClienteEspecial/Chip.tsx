"use client";
import { useState } from "react";
import "./Chip.css";
interface ChipProps {
  label: string;
}
export default function Chip({ label }: ChipProps) {
  const [selected, setSelected] = useState(false);
  return (
    <button
      className={`chip ${selected ? "active" : ""}`}
      onClick={() => setSelected(!selected)}
    >
      {label}
    </button>
  );
}
