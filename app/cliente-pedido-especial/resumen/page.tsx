"use client";
import "./resumen.css";
import HeaderClienteEspecial from "@/componentsClienteEspecial/HeaderClienteEspecial";
import OrderSummary from "@/componentsClienteEspecial/OrderSummary";
import ButtonPrimary from "@/componentsClienteEspecial/ButtonPrimary";
export default function ResumenPage() {
  return (
    <main className="resumen-page">
      <HeaderClienteEspecial title="Resumen" />
      <section className="section">
        <OrderSummary />
      </section>
      <section className="bottom-space">
        <ButtonPrimary
          text="Confirmar Pedido"
          href="/cliente-pedido-especial/confirmacion"
        />
      </section>
    </main>
  );
}
