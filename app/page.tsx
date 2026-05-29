import "../styles/dashboard.css";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import FlavorHeatmap from "../components/FlavorHeatmap";
import LowStockAlerts from "../components/LowStockAlerts";
import CustomBoxesTable from "../components/CustomBoxesTable";
import ShowcaseStock from "../components/ShowcaseStock";
import CustomerHistory from "../components/CustomerHistory";
import SpecialDatesFilter from "../components/SpecialDatesFilter";
import ShippingClassification from "../components/ShippingClassification";
import SeasonalDemandChart from "../components/SeasonalDemandChart";

export default function LegalRepresentativeDashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <Header />

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

        <section className="charts-section">
          <SalesChart />
          <SeasonalDemandChart />
        </section>

        <section className="double-section">
          <FlavorHeatmap />
          <ShowcaseStock />
        </section>

        <section className="double-section">
          <LowStockAlerts />
          <ShippingClassification />
        </section>

        <section className="tables-section">
          <CustomBoxesTable />
          <CustomerHistory />
        </section>

        <section className="bottom-section">
          <SpecialDatesFilter />
        </section>
      </main>
    </div>
  );
}