import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || process.env.POSTGRES_USER || 'donuts',
      password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'donuts_pass',
      database: process.env.PGDATABASE || process.env.POSTGRES_DB || 'donuts_db',
    });
  }
  return pool;
}

export async function ensureOrdersTable() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      client_name TEXT,
      telefono TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      delivery_at TEXT,
      status TEXT DEFAULT 'PENDIENTE',
      total NUMERIC DEFAULT 0,
      items JSONB
    );
  `);
  // Ensure telefono and delivery_at columns exist for older schemas and migrate type if needed
  await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS telefono TEXT;");
  await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_at TEXT;");
  await pool.query(
    "ALTER TABLE orders ALTER COLUMN delivery_at TYPE TEXT USING delivery_at::text;",
  );
}

export async function ensureProductionTable() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS production (
      sabor TEXT PRIMARY KEY,
      producidas INTEGER DEFAULT 0,
      vendidas INTEGER DEFAULT 0,
      precio NUMERIC DEFAULT 6
    );
  `);

  const res = await pool.query('SELECT COUNT(*) as c FROM production');
  const count = Number(res.rows[0]?.c || 0);
  if (count === 0) {
    const seed = [
      ['Canela', 320, 295, 6],
      ['Chicle', 280, 260, 6],
      ['Chocolate', 360, 330, 6],
      ['Chirimoya', 220, 200, 6],
      ['Frutilla', 340, 320, 6],
      ['Limón', 210, 190, 6],
      ['Mora', 250, 230, 6],
      ['Naranja', 230, 210, 6],
      ['Piña', 270, 250, 6],
      ['Vainilla', 300, 280, 6],
    ];
    const insertPromises = seed.map(s => pool.query('INSERT INTO production (sabor, producidas, vendidas, precio) VALUES ($1,$2,$3,$4)', s));
    await Promise.all(insertPromises);
  }
}

export async function ensureCustomersTable() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      telefono VARCHAR(20) UNIQUE NOT NULL,
      sabor_favorito VARCHAR(100),
      compras INTEGER DEFAULT 0,
      ultima_compra TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function ensureInventoryTable() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      unidad VARCHAR(50) NOT NULL,
      precio_unitario NUMERIC(10,2) NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}