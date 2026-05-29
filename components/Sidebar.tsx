import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Sweet Admin</h2>

      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Ventas</li>
          <li>Clientes</li>
          <li>Inventario</li>
          <li>Pedidos</li>
          <li>Producción</li>
          <li>Reportes</li>
          <li>Configuración</li>
        </ul>
      </nav>
    </aside>
  );
}