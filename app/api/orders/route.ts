import { NextResponse } from "next/server";
import { getPool, ensureOrdersTable, ensureProductionTable, ensureCustomersTable } from "@/lib/db";

const specialCajaNames = [
  "Especial Día del Padre",
  "Especial día de la Madre",
  "Especial día del Niño",
];

function calcDeltas(prevItems: any[], nextItems: any[]) {
  const deltas: Record<string, number> = {};
  for (const p of prevItems) { deltas[p.sabor] = (deltas[p.sabor] || 0) - Number(p.units || 0); }
  for (const n of nextItems) { deltas[n.sabor] = (deltas[n.sabor] || 0) + Number(n.units || 0); }
  return deltas;
}

function isSpecialCaja(sabor: string) {
  return specialCajaNames.includes(sabor);
}

export async function GET() {
  const pool = getPool();
  await ensureOrdersTable();
  await ensureCustomersTable();
  const res = await pool.query(
    `SELECT o.*, COALESCE(o.telefono, c.telefono) AS telefono
     FROM orders o
     LEFT JOIN customers c ON o.client_name = c.nombre
     ORDER BY o.id DESC`
  );
  const rows = res.rows.map((r: any) => ({
    ...r,
    created_at: r.created_at?.toISOString(),
    delivery_at: r.delivery_at || null,
  }));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const pool = getPool();
  await ensureOrdersTable();
  await ensureProductionTable();
  const body = await request.json();
  const { client_name, items, telefono } = body;
  await ensureCustomersTable();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  try {
    for (const it of items) {
      const sabor = it.sabor;
      const units = Number(it.units || 0);
      if (isSpecialCaja(sabor)) continue;

      const r = await pool.query('SELECT producidas, vendidas FROM production WHERE sabor=$1', [sabor]);
      if (r.rowCount === 0) {
        return NextResponse.json({ error: `Sabor ${sabor} no existe` }, { status: 400 });
      }
      const { producidas, vendidas } = r.rows[0];
      const available = Number(producidas || 0) - Number(vendidas || 0);
      if (units > available) {
        return NextResponse.json({ error: `Stock insuficiente para ${sabor}. Disponible: ${available}` }, { status: 400 });
      }
    }

    const total = items.reduce((s: number, it: any) => s + (Number(it.units || 0) * Number(it.unit_price || 0)), 0);
    const delivery_at = body.delivery_at || null;
    const insert = await pool.query(
      'INSERT INTO orders (client_name, telefono, status, total, items, delivery_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [client_name || 'Cliente', telefono || null, 'PENDIENTE', total, JSON.stringify(items), delivery_at],
    );
    if (telefono) {

  const cliente = await pool.query(
    "SELECT * FROM customers WHERE telefono = $1",
    [telefono]
  );

  if (cliente.rows.length > 0) {

    await pool.query(
      `
      UPDATE customers
      SET
        compras = compras + 1,
        ultima_compra = CURRENT_TIMESTAMP
      WHERE telefono = $1
      `,
      [telefono]
    );

  } else {

    await pool.query(
      `
      INSERT INTO customers
      (
        nombre,
        telefono,
        compras,
        ultima_compra
      )
      VALUES
      (
        $1,
        $2,
        1,
        CURRENT_TIMESTAMP
      )
      `,
      [client_name || "Cliente", telefono]
    );

  }
}   
    const orderRow = insert.rows[0];
    orderRow.created_at = orderRow.created_at?.toISOString();
    orderRow.delivery_at = orderRow.delivery_at || null;
    return NextResponse.json(orderRow);
  } catch(err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const pool = getPool();
  await ensureOrdersTable();
  await ensureProductionTable();

  const body = await request.json();
  const { id, client_name, items, status, telefono } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const prevRes = await pool.query('SELECT status, items, telefono FROM orders WHERE id=$1 FOR UPDATE', [id]);
  if (prevRes.rowCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const prevStatus = prevRes.rows[0].status;
  const prevItems = prevRes.rows[0].items || [];
  const newItems = Array.isArray(items) ? items : prevItems;
  const newStatus = typeof status === 'string' ? status : prevStatus;

  try {
    await pool.query('BEGIN');

    if (Array.isArray(items) && prevStatus === 'ENTREGADO') {
      const deltas = calcDeltas(prevItems, newItems);
      for (const sabor of Object.keys(deltas)) {
        if (isSpecialCaja(sabor)) continue;
        const delta = deltas[sabor];
        if (delta !== 0) {
          if (delta > 0) {
            const r = await pool.query('SELECT producidas, vendidas FROM production WHERE sabor=$1 FOR UPDATE', [sabor]);
            if (r.rowCount === 0) { await pool.query('ROLLBACK'); return NextResponse.json({ error: `Sabor ${sabor} no existe` }, { status: 400 }); }
            const { producidas, vendidas } = r.rows[0];
            const available = Number(producidas || 0) - Number(vendidas || 0);
            if (delta > available) { await pool.query('ROLLBACK'); return NextResponse.json({ error: `Stock insuficiente para ${sabor}. Disponible: ${available}` }, { status: 400 }); }
          }
          await pool.query('UPDATE production SET vendidas = vendidas + $1 WHERE sabor=$2', [delta, sabor]);
        }
      }
    }

    if (prevStatus !== 'ENTREGADO' && newStatus === 'ENTREGADO') {
      for (const item of newItems) {
        const sabor = item.sabor;
        const units = Number(item.units || 0);
        if (units <= 0 || isSpecialCaja(sabor)) continue;
        const r = await pool.query('SELECT producidas, vendidas FROM production WHERE sabor=$1 FOR UPDATE', [sabor]);
        if (r.rowCount === 0) { await pool.query('ROLLBACK'); return NextResponse.json({ error: `Sabor ${sabor} no existe` }, { status: 400 }); }
        const { producidas, vendidas } = r.rows[0];
        const available = Number(producidas || 0) - Number(vendidas || 0);
        if (units > available) { await pool.query('ROLLBACK'); return NextResponse.json({ error: `Stock insuficiente para ${sabor}. Disponible: ${available}` }, { status: 400 }); }
        await pool.query('UPDATE production SET vendidas = vendidas + $1 WHERE sabor=$2', [units, sabor]);
      }
    }

    if (prevStatus === 'ENTREGADO' && newStatus !== 'ENTREGADO') {
      for (const item of newItems) {
        const sabor = item.sabor;
        const units = Number(item.units || 0);
        if (isSpecialCaja(sabor)) continue;
        await pool.query('UPDATE production SET vendidas = vendidas - $1 WHERE sabor=$2', [units, sabor]);
      }
    }

    if (Array.isArray(items)) {
      const total = newItems.reduce((s: number, it: any) => s + (Number(it.units || 0) * Number(it.unit_price || 0)), 0);
      const delivery_at = body.delivery_at || null;
      await pool.query(
        'UPDATE orders SET client_name=$1, telefono=$2, items=$3, total=$4, delivery_at=$5, status=$6 WHERE id=$7',
        [client_name || 'Cliente', telefono || null, JSON.stringify(newItems), total, delivery_at, newStatus, id],
      );
    } else if (typeof status === 'string') {
      await pool.query('UPDATE orders SET status=$1 WHERE id=$2', [newStatus, id]);
    }

    const res = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
    const row = res.rows[0];
    await pool.query('COMMIT');
    if (row) {
      row.created_at = row.created_at?.toISOString();
      row.delivery_at = row.delivery_at || null;
      return NextResponse.json(row);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}

export async function DELETE() {
  const pool = getPool();
  try {
    await ensureOrdersTable();
    await ensureProductionTable();
    await ensureCustomersTable();

    // Limpiar todos los pedidos
    await pool.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE;');

    // Limpiar todos los clientes y reiniciar su identidad
    await pool.query('TRUNCATE TABLE customers RESTART IDENTITY CASCADE;');

    // Resetear vendidas a 0 en producción, manteniendo producidas
    await pool.query('UPDATE production SET vendidas = 0;');

    return NextResponse.json(
      { success: true, message: "Todos los pedidos y clientes han sido eliminados correctamente, y las ventas reiniciadas." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error crítico al limpiar la base de datos:", error);
    return NextResponse.json(
      { error: "Hubo un error al intentar limpiar desde el backend." },
      { status: 500 }
    );
  }
}
