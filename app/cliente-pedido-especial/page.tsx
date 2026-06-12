"use client";
import "./home.css";
import HeaderClienteEspecial from "@/componentsClienteEspecial/HeaderClienteEspecial";
import DonutCard from "@/componentsClienteEspecial/DonutCard";
import BottomNavigation from "@/componentsClienteEspecial/BottomNavigation";
import ButtonPrimary from "@/componentsClienteEspecial/ButtonPrimary";
export default function HomePage() {
  return (
    <main className="home-page">
      <HeaderClienteEspecial title="The Donut Factory" />
      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-text">
            <span>Diseña tus donas</span>
            <h1>Donas únicas para tus eventos</h1>
            <p>Personaliza sabores, toppings y decoración.</p>
            <ButtonPrimary
              text="Pedido Especial"
              href="/cliente-pedido-especial/personalizar"
            />
          </div>
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b"
            alt="Donut"
          />
        </div>
      </section>
      <section className="home-products">
        <h2>Donas destacadas</h2>
        <div className="donut-list">
          <DonutCard
            image="https://images.unsplash.com/photo-1551024601-bec78aea704b"
            title="Fresa"
            price="Bs4.50"
          />
          <DonutCard
            image="https://images.unsplash.com/photo-1509440159596-0249088772ff"
            title="Chocolate"
            price="Bs4.90"
          />
        </div>
      </section>
      <BottomNavigation />
    </main>
  );
}
