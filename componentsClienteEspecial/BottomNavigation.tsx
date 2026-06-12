"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Cookie, Package } from "@phosphor-icons/react";
import "./BottomNavigation.css";
export default function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      <Link
        href="/cliente-pedido-especial"
        className={`nav-item ${
          pathname === "/cliente-pedido-especial" ? "active" : ""
        }`}
      >
        <House size={24} weight="fill" className="nav-icon" />
        <span>Inicio</span>
      </Link>
      <Link
        href="/cliente-pedido-especial/personalizar"
        className={`nav-item ${
          pathname === "/cliente-pedido-especial/personalizar" ? "active" : ""
        }`}
      >
        <Cookie size={24} weight="fill" className="nav-icon" />
        <span>Personalizar</span>
      </Link>
      <Link
        href="/cliente-pedido-especial/seguimiento"
        className={`nav-item ${
          pathname === "/cliente-pedido-especial/seguimiento" ? "active" : ""
        }`}
      >
        <Package size={24} weight="fill" className="nav-icon" />
        <span>Pedidos</span>
      </Link>
    </nav>
  );
}
