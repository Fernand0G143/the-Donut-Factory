"use client";
import "./confirmacion.css";
import HeaderClienteEspecial from "@/componentsClienteEspecial/HeaderClienteEspecial";
import ButtonPrimary from "@/componentsClienteEspecial/ButtonPrimary";
export default function ConfirmacionPage() {
  return (
    <main className="confirmacion-page">
      <HeaderClienteEspecial title="Pedido Confirmado" />
      <section className="confirm-box">
        <div className="success-circle">✓</div>
        <h1>¡Pedido realizado!</h1>
        <p>Tu pedido especial fue registrado correctamente.</p>
        <div className="order-info">
          <div>
            <span>Número</span>
            <strong>#DF-2045</strong>
          </div>
          <div>
            <span>Tiempo estimado</span>
            <strong>45 min</strong>
          </div>
        </div>
      </section>
      <section className="bottom-space">
        <ButtonPrimary
          text="Ver Seguimiento"
          href="/cliente-pedido-especial/seguimiento"
        />
      </section>
    </main>
  );
}
