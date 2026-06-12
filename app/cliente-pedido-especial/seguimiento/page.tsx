"use client";
import "./seguimiento.css";
import HeaderClienteEspecial from "@/componentsClienteEspecial/HeaderClienteEspecial";
import OrderTracking from "@/componentsClienteEspecial/OrderTracking";
import BottomNavigation from "@/componentsClienteEspecial/BottomNavigation";
export default function SeguimientoPage() {
  return (
    <main className="seguimiento-page">
      <HeaderClienteEspecial title="Seguimiento" />
      <section className="section">
        <OrderTracking />
      </section>
      <section className="status-card">
        <h2>Estado actual</h2>
        <p>Tu pedido se encuentra en preparación.</p>
        <div className="status-pill">En preparación</div>
      </section>
      <BottomNavigation />
    </main>
  );
}
