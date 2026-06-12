"use client";
import "./personalizar.css";
import HeaderClienteEspecial from "@/componentsClienteEspecial/HeaderClienteEspecial";
import Chip from "@/componentsClienteEspecial/Chip";
import QuantitySelector from "@/componentsClienteEspecial/QuantitySelector";
import UploadBox from "@/componentsClienteEspecial/UploadBox";
import ButtonPrimary from "@/componentsClienteEspecial/ButtonPrimary";
export default function PersonalizarPage() {
  return (
    <main className="personalizar-page">
      <HeaderClienteEspecial title="Personalizar" />
      <section className="section">
        <h2>Sabores</h2>
        <div className="chips">
          <Chip label="Chocolate" />
          <Chip label="Vainilla" />
          <Chip label="Fresa" />
          <Chip label="Caramelo" />
        </div>
      </section>
      <section className="section">
        <h2>Toppings</h2>
        <div className="chips">
          <Chip label="Chispas" />
          <Chip label="Malvaviscos" />
          <Chip label="Oreo" />
          <Chip label="Nutella" />
        </div>
      </section>
      <section className="section">
        <QuantitySelector />
      </section>
      <section className="section">
        <h2>Referencia visual</h2>
        <UploadBox />
      </section>
      <section className="bottom-space">
        <ButtonPrimary
          text="Continuar"
          href="/cliente-pedido-especial/entrega"
        />
      </section>
    </main>
  );
}
