import { NextResponse } from "next/server";
import { getPool, ensureCustomersTable, ensureOrdersTable } from "@/lib/db";

export async function GET() {
  const pool = getPool();

  await ensureCustomersTable();
  await ensureOrdersTable();

  const customersRes = await pool.query(`
    SELECT id, nombre, telefono, sabor_favorito, compras, ultima_compra, created_at
    FROM customers
    ORDER BY compras DESC, created_at DESC
  `);

  const totalRes = await pool.query(`
    SELECT COUNT(*) AS total_customers
    FROM customers
  `);

  const frecuentesRes = await pool.query(`
    SELECT COUNT(*) AS clientes_frecuentes
    FROM (
      SELECT COALESCE(o.telefono, c.telefono) AS telefono
      FROM orders o
      LEFT JOIN customers c ON o.client_name = c.nombre
      WHERE COALESCE(o.telefono, c.telefono) IS NOT NULL
      GROUP BY COALESCE(o.telefono, c.telefono)
      HAVING COUNT(DISTINCT DATE(o.created_at)) > 1
    ) AS frecuentes;
  `);

  const nuevosRes = await pool.query(`
    SELECT COUNT(*) AS clientes_nuevos
    FROM customers
    WHERE created_at::date = CURRENT_DATE
  `);

  const customers = customersRes.rows.map((row: any) => ({
    ...row,
    compras: Number(row.compras || 0),
    ultima_compra: row.ultima_compra?.toISOString() || null,
    created_at: row.created_at?.toISOString() || null,
  }));

  const stats = {
    totalClientes: Number(totalRes.rows[0]?.total_customers || 0),
    clientesFrecuentes: Number(frecuentesRes.rows[0]?.clientes_frecuentes || 0),
    clientesNuevos: Number(nuevosRes.rows[0]?.clientes_nuevos || 0),
  };

  return NextResponse.json({ stats, customers });
}