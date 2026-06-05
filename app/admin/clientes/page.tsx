"use client";

import { useEffect, useState } from "react";

import "@/styles/dashboard.css";
import "@/styles/tables.css";
import "@/styles/cards.css";

type Customer = {
  id: number;
  nombre: string;
  telefono: string;
  sabor_favorito?: string | null;
  compras: number;
  ultima_compra?: string | null;
  created_at?: string | null;
};

type Stats = {
  totalClientes: number;
  clientesFrecuentes: number;
  clientesNuevos: number;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClientes: 0,
    clientesFrecuentes: 0,
    clientesNuevos: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data.customers || []);
    setStats(data.stats || {
      totalClientes: 0,
      clientesFrecuentes: 0,
      clientesNuevos: 0,
    });
  }

  return (
    <div className="panel_card">
      <header className="encabezado_panel">
        <div className="encabezado_contenido">
          <h1>Gestión de Clientes</h1>
          <p>
            Historial, preferencias y seguimiento comercial
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stats-card">
          <h3>Total Clientes</h3>
          <h2>{stats.totalClientes}</h2>
        </div>

        <div className="stats-card">
          <h3>Clientes Frecuentes</h3>
          <h2>{stats.clientesFrecuentes}</h2>
        </div>

        <div className="stats-card">
          <h3>Clientes Nuevos</h3>
          <h2>{stats.clientesNuevos}</h2>
        </div>
      </section>

      <section className="table-card">
        <div className="filter-bar">
          <input type="text" placeholder="Buscar cliente..." disabled />

          <select disabled>
            <option>Todos</option>
            <option>Frecuentes</option>
            <option>Nuevos</option>
          </select>

          <select disabled>
            <option>Filtrar por fecha</option>
            <option>Cumpleaños</option>
            <option>Aniversarios</option>
          </select>

          <button disabled>Buscar</button>
        </div>
      </section>

      <section className="table-card">
        <h2 className="titulo_tabla">Listado de clientes</h2>

        <table className="tabla_clientes">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Sabor Favorito</th>
              <th>Compras</th>
              <th>Última Compra</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.telefono}</td>
                <td>{c.sabor_favorito || "-"}</td>
                <td>{c.compras}</td>
                <td>
                  {c.ultima_compra
                    ? new Date(c.ultima_compra).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
