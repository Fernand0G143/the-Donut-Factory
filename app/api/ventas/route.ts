import { NextResponse } from "next/server";
import { getPool, ensureOrdersTable, ensureProductionTable, ensureCustomersTable } from "@/lib/db";

export async function GET() {
  const pool = getPool();
  await ensureOrdersTable();
  await ensureProductionTable();
  await ensureCustomersTable();

  try {
    // Obtener todos los pedidos entregados
    const res = await pool.query(
      `SELECT o.id, o.client_name, o.items, o.total, o.created_at, o.delivery_at, COALESCE(o.telefono, c.telefono) AS telefono
       FROM orders o
       LEFT JOIN customers c ON o.client_name = c.nombre
       WHERE o.status = 'ENTREGADO'
       ORDER BY o.id DESC`
    );

    // Procesar cada pedido para extraer sabores, cantidades y teléfono
    const ventas = res.rows.flatMap((order: any) => {
      const items = Array.isArray(order.items) ? order.items : [];
      return items.map((item: any) => ({
        id_pedido: order.id,
        cliente: order.client_name,
        telefono: order.telefono || null,
        sabor: item.sabor,
        cantidad: Number(item.units),
        precio_unitario: Number(item.unit_price),
        subtotal: Number(item.units) * Number(item.unit_price),
        fecha: order.created_at,
      }));
    });

    return NextResponse.json(ventas);
  } catch (error) {
    console.error("Error obtaining sales:", error);
    return NextResponse.json({ error: "Error obtaining sales" }, { status: 500 });
  }
}

// Calcular resumen de ventas
export async function POST(request: Request) {
  const pool = getPool();
  await ensureOrdersTable();

  try {
    const body = await request.json();
    const { action } = body;

    // Si acción es "resumen", calcula totales de ventas
    if (action === "resumen") {
      const res = await pool.query(
        "SELECT COUNT(*) as total_pedidos, COALESCE(SUM(total), 0) as ingresos_totales FROM orders WHERE status = 'ENTREGADO'"
      );

      const row = res.rows[0];
      return NextResponse.json({
        total_pedidos: Number(row.total_pedidos),
        ingresos_totales: Number(row.ingresos_totales),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error calculating sales summary:", error);
    return NextResponse.json(
      { error: "Error calculating sales summary" },
      { status: 500 }
    );
  }
}
