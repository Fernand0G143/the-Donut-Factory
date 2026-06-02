import Link from "next/link";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>the Donut Factory</h2>

      <nav>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/pedidos">Pedidos</Link>
          </li>
          <li>
            <Link href="/admin/ventas">Ventas</Link>
          </li>
          <li>
            <Link href="/admin/produccion">Producción</Link>
          </li>
          <li>
            <Link href="/admin/clientes">Clientes</Link>
          </li>
          <li>Inventario</li>
          <li>Reportes</li>
          <li>
            <Link href="/admin/configuracion">Configuración</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}