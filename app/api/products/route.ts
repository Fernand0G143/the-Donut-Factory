import { getPool, ensureInventoryTable } from "@/lib/db";

export async function GET() {
  try {
    await ensureInventoryTable();
    const pool = getPool();
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    return Response.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureInventoryTable();
    const pool = getPool();
    const body = await req.json();
    const { nombre, unidad, precio_unitario, cantidad } = body;

    if (!nombre || !unidad || precio_unitario === undefined || cantidad === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO products (nombre, unidad, precio_unitario, cantidad) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, unidad, precio_unitario, cantidad]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureInventoryTable();
    const pool = getPool();
    const body = await req.json();
    const { id, nombre, unidad, precio_unitario, cantidad } = body;

    if (!id || !nombre || !unidad || precio_unitario === undefined || cantidad === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE products 
       SET nombre = $1, unidad = $2, precio_unitario = $3, cantidad = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [nombre, unidad, precio_unitario, cantidad, id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureInventoryTable();
    const pool = getPool();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return Response.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    }

    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
