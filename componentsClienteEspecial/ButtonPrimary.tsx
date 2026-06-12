"use client";
import Link from "next/link";
import "./ButtonPrimary.css";
interface ButtonPrimaryProps {
  text: string;
  href?: string;
}
export default function ButtonPrimary({
  text,
  href = "#",
}: ButtonPrimaryProps) {
  return (
    <Link href={href} className="button-primary">
      <span>{text}</span>
      <div className="button-arrow">→</div>
    </Link>
  );
}
