"use client";
import { useEffect, useState } from "react";
import "@/styles/dashboard.css";
import "@/styles/tables.css";
import "@/styles/cards.css";
import "@/styles/AdminVentas.css";
import StatsCard from "@/components/StatsCard";
import TableCard from "@/components/TableCard";

type Venta = {
  id_pedido: number;
  cliente: string;
  telefono?: string;
  sabor: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha: string;
};

type Resumen = {
  total_pedidos: number;
  ingresos_totales: number;
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [resumen, setResumen] = useState<Resumen>({
    total_pedidos: 0,
    ingresos_totales: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterSabor, setFilterSabor] = useState("");
  const [filterFecha, setFilterFecha] = useState("");

  useEffect(() => {
    fetchVentas();
    fetchResumen();
  }, []);

  async function fetchVentas() {
    setLoading(true);
    try {
      const res = await fetch("/api/ventas");
      const data = await res.json();
      setVentas(data);
    } catch (e) {
      console.error(e);
      setVentas([]);
    }
    setLoading(false);
  }

  async function fetchResumen() {
    try {
      const res = await fetch("/api/ventas", {
        method: "POST",
        body: JSON.stringify({ action: "resumen" }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResumen(data);
    } catch (e) {
      console.error(e);
    }
  }

  function formatMoney(value: any) {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  }

  function formatId(id: number) {
    return `#${String(id).padStart(3, "0")}`;
  }

  const filtered = ventas.filter((v) => {
    if (filterSabor && !v.sabor.toLowerCase().includes(filterSabor.toLowerCase())) {
      return false;
    }
    if (filterFecha) {
      const d = new Date(v.fecha).toISOString().slice(0, 10);
      if (d !== filterFecha) return false;
    }
    return true;
  });

  const saboresUnicos = new Set(ventas.map((v) => v.sabor));
  const totalCajas = ventas
    .filter((v) => v.sabor.includes("Especial"))
    .reduce((sum, v) => sum + v.cantidad, 0);
  const totalDonas = ventas
    .filter((v) => !v.sabor.includes("Especial"))
    .reduce((sum, v) => sum + v.cantidad, 0);

  return (
    <div className="panel_ventas">
      <header className="encabezado_panel">
        <div className="encabezado_contenido">
          <h1>Panel de Ventas</h1>
          <p className="panel-subtitle">
            Reporte de ventas entregadas, ingresos y análisis comercial
          </p>
        </div>
      </header>

      <div className="contenedor_resumen_ventas">
        <StatsCard title="Pedidos Entregados" value={String(resumen.total_pedidos)} className="tarjeta_total" />
        <StatsCard title="Sabores Vendidos" value={String(saboresUnicos.size)} />
        <StatsCard title="Donas Vendidas" value={String(totalDonas)} />
        <StatsCard title="Cajas Especiales" value={String(totalCajas)} />
        <StatsCard title="Ingresos Totales" value={`Bs ${formatMoney(resumen.ingresos_totales)}`} className="tarjeta_total" />
      </div>

      <div className="contenedor_secciones_ventas">
        <TableCard className="tarjeta_tabla_ventas">
          <div className="table-card-header">
            <h2 className="titulo_tabla">Detalle de Ventas</h2>
            <div className="barra_filtros_ventas">
              <input
                type="text"
                placeholder="Buscar por sabor..."
                value={filterSabor}
                onChange={(e) => setFilterSabor(e.target.value)}
                className="entrada_texto_filtro_ventas"
              />
              <input
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="entrada_fecha_filtro_ventas"
              />
              <button
                onClick={() => {
                  setFilterSabor("");
                  setFilterFecha("");
                }}
                className="boton_limpiar_filtros_ventas"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {loading ? (
            <p className="texto_cargando_ventas">Cargando información del servidor...</p>
          ) : filtered.length === 0 ? (
            <p className="texto_no_encontrado_ventas">No se encontraron ventas bajo los criterios de búsqueda.</p>
          ) : (
            <table className="tabla_ventas">
              <thead>
                <tr>
                  <th className="tabla_encabezado_ventas tabla_encabezado_id_ventas">ID</th>
                  <th className="tabla_encabezado_ventas tabla_encabezado_telefono_ventas">Teléfono</th>
                  <th className="tabla_encabezado_ventas tabla_encabezado_detalle_ventas">Detalle</th>
                  <th className="tabla_encabezado_ventas tabla_encabezado_cantidad_ventas">Cantidad</th>
                  <th className="tabla_encabezado_ventas tabla_encabezado_fecha_ventas">Fecha</th>
                  <th className="tabla_encabezado_ventas tabla_encabezado_ingreso_ventas">Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, idx) => (
                  <tr key={idx} className="tabla_fila_ventas">
                    <td className="tabla_celda_ventas tabla_celda_id_ventas">{formatId(v.id_pedido)}</td>
                    <td className="tabla_celda_ventas tabla_celda_telefono_ventas">{v.telefono || '-'}</td>
                    <td className="tabla_celda_ventas tabla_celda_detalle_ventas">{v.sabor}</td>
                    <td className="tabla_celda_ventas tabla_celda_cantidad_ventas">{v.cantidad}</td>
                    <td className="tabla_celda_ventas tabla_celda_fecha_ventas">
                      {v.fecha ? new Date(v.fecha).toLocaleDateString() : "-"}
                    </td>
                    <td className="tabla_celda_ventas tabla_celda_ingreso_ventas">Bs {formatMoney(v.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </div>
    </div>
  );
}
