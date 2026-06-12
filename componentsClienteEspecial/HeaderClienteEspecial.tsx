"use client";
import Image from "next/image";
import "./HeaderClienteEspecial.css";
interface HeaderProps {
  title: string;
}
export default function HeaderClienteEspecial({ title }: HeaderProps) {
  return (
    <header className="header-cliente">
      <button className="header-icon">
        <Image src="/icondonut.png" alt="Logo" width={80} height={80} />
      </button>
      <h1>{title}</h1>
      <div className="header-space"></div>
    </header>
  );
}
