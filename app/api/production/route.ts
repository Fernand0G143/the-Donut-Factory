import { NextResponse } from "next/server";
import { getPool, ensureProductionTable } from "@/lib/db";

export async function GET() {
  const pool = getPool();
  await ensureProductionTable();
  const res = await pool.query(
    'SELECT sabor, producidas, vendidas, precio, (producidas - vendidas) AS disponibles FROM production ORDER BY sabor'
  );
  return NextResponse.json(res.rows);
}

export async function PUT(request: Request) {
  const pool = getPool();
  await ensureProductionTable();
  const body = await request.json();
  const { original_sabor, sabor, producidas, precio } = body;

  if (!original_sabor || !sabor) {
    return NextResponse.json({ error: 'Falta el identificador del sabor.' }, { status: 400 });
  }

  try {
    // Obtener vendidas actuales para validar que no dejemos producidas por debajo de vendidas
    const cur = await pool.query('SELECT vendidas FROM production WHERE sabor=$1', [original_sabor]);
    if (cur.rowCount === 0) {
      return NextResponse.json({ error: 'Sabor no encontrado.' }, { status: 404 });
    }
    const currentVendidas = Number(cur.rows[0].vendidas || 0);
    const newProducidas = Number(producidas || 0);
    if (newProducidas < currentVendidas) {
      return NextResponse.json({ error: `No se puede reducir U. producidas por debajo de U. vendidas (${currentVendidas}).` }, { status: 400 });
    }

    const res = await pool.query(
      'UPDATE production SET sabor=$1, producidas=$2, precio=$3 WHERE sabor=$4 RETURNING sabor, producidas, vendidas, precio, (producidas - vendidas) AS disponibles',
      [sabor, newProducidas, Number(precio || 0), original_sabor]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar la producción.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const pool = getPool();
  await ensureProductionTable();
  const body = await request.json();
  const { sabor } = body;

  if (!sabor) {
    return NextResponse.json({ error: 'Falta el nombre del sabor.' }, { status: 400 });
  }

  try {
    const res = await pool.query('DELETE FROM production WHERE sabor=$1', [sabor]);
    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Sabor no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el sabor.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const pool = getPool();
  await ensureProductionTable();

  try {
    const body = await request.json();

    const { sabor, producidas, precio } = body;

    if (!sabor || !sabor.trim()) {
      return NextResponse.json(
        { error: "El nombre del sabor es obligatorio." },
        { status: 400 }
      );
    }

    if (!precio || Number(precio) <= 0) {
      return NextResponse.json(
        { error: "El precio es obligatorio." },
        { status: 400 }
      );
    }

const existe = await pool.query(
  "SELECT sabor FROM production WHERE sabor = $1",
  [sabor.trim()]
);

if (existe.rows.length > 0) {
  return NextResponse.json(
    { error: "Ese sabor ya existe." },
    { status: 400 }
  );
}


    const res = await pool.query(
      `INSERT INTO production
      (sabor, producidas, vendidas, precio)
      VALUES ($1,$2,0,$3)
      RETURNING
      sabor,
      producidas,
      vendidas,
      precio,
      (producidas - vendidas) AS disponibles`,
      [
        sabor.trim(),
        Number(producidas || 0),
        Number(precio)
      ]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al crear sabor." },
      { status: 500 }
    );
  }
}