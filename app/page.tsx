"use client";

import "../styles/dashboard.css";
import "../styles/cards.css";
import "../styles/charts.css";
import "../styles/tables.css";

import Sidebar from "../components/MainMenu";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import FlavorHeatmap from "../components/FlavorHeatmap";
import LowStockAlerts from "../components/LowStockAlerts";
import CustomBoxesTable from "../components/CustomBoxesTable";
import ShowcaseStock from "../components/ShowcaseStock";
import CustomerHistory from "../components/HistorialClientes";
import SpecialDatesFilter from "../components/SpecialDatesFilter";
import ShippingClassification from "../components/ShippingClassification";
import SeasonalDemandChart from "../components/SeasonalDemandChart";

export default function LegalRepresentativeDashboard() {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="dashboard-main">

        {/* Header */}
        <Header />

        {/* Tarjetas resumen */}
        <section className="stats-grid">

          <StatsCard
            title="Ventas del día"
            value="Bs 5,240"
          />

          <StatsCard
            title="Ganancia semanal"
            value="Bs 18,900"
          />

          <StatsCard
            title="Pedidos especiales"
            value="24"
          />

          <StatsCard
            title="Alertas críticas"
            value="5"
          />

        </section>

        {/* Gráficas */}
        <section className="charts-section">

          <SalesChart />

          <SeasonalDemandChart />

        </section>

        {/* Producción y vitrina */}
        <section className="double-section">

          <FlavorHeatmap />

          <ShowcaseStock />

        </section>

        {/* Alertas e inventario */}
        <section className="double-section">

          <LowStockAlerts />

          <ShippingClassification />

        </section>

        {/* Clientes y cajas */}
        <section className="tables-section">

          <CustomBoxesTable />

          <CustomerHistory />

        </section>

        {/* Fechas especiales */}
        <section className="bottom-section">

          <SpecialDatesFilter />

        </section>

      </main>
    </div>
  );
}