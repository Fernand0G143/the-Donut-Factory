"use client";
import "./entrega.css";
import HeaderClienteEspecial from "@/componentsClienteEspecial/HeaderClienteEspecial";
import DeliveryScheduler from "@/componentsClienteEspecial/DeliveryScheduler";
import ButtonPrimary from "@/componentsClienteEspecial/ButtonPrimary";
export default function EntregaPage() {
  return (
    <main className="entrega-page">
      <HeaderClienteEspecial title="Entrega" />
      <section className="section">
        <DeliveryScheduler />
      </section>
      <section className="bottom-space">
        <ButtonPrimary
          text="Ver Resumen"
          href="/cliente-pedido-especial/resumen"
        />
      </section>
    </main>
  );
}
