"use client";

import { useEffect, useState } from "react";
import "@/styles/dashboard.css";
import "@/styles/tables.css";
import "@/styles/cards.css";
import "@/styles/AdminPedidos.css";

type Product = {
  id: number;
  nombre: string;
  unidad: string;
  precio_unitario: number;
  cantidad: number;
  created_at: string;
  updated_at: string;
};

const formatMoney = (value: any) => {
  const num = Number(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precio_unitario, setPrecio_unitario] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [errorMensaje, setErrorMensaje] = useState("");

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
      setErrorMensaje("Error al cargar productos");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function openNew() {
    setEditing(null);
    setNombre("");
    setUnidad("");
    setPrecio_unitario(0);
    setCantidad(0);
    setErrorMensaje("");
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setNombre(product.nombre);
    setUnidad(product.unidad);
    setPrecio_unitario(product.precio_unitario);
    setCantidad(product.cantidad);
    setErrorMensaje("");
    setShowModal(true);
  }

  async function submitProduct() {
    if (!nombre.trim()) {
      setErrorMensaje("El nombre del producto es requerido");
      return;
    }
    if (!unidad.trim()) {
      setErrorMensaje("La unidad es requerida");
      return;
    }
    if (precio_unitario <= 0) {
      setErrorMensaje("El precio debe ser mayor a 0");
      return;
    }
    if (cantidad < 0) {
      setErrorMensaje("La cantidad no puede ser negativa");
      return;
    }

    const payload = {
      nombre,
      unidad,
      precio_unitario,
      cantidad,
      ...(editing && { id: editing.id }),
    };

    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch("/api/products", {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        await fetchData();
        setShowModal(false);
        setErrorMensaje("");
      } else {
        const error = await res.json();
        setErrorMensaje(error.error || "Error al guardar producto");
      }
    } catch (e) {
      console.error(e);
      setErrorMensaje("Error de conexión");
    }
  }

  async function deleteProduct(id: number) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        await fetchData();
      } else {
        alert("Error al eliminar producto");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  }

  const totalProductos = products.length;
  const totalInventario = products.reduce(
    (s, p) => s + p.cantidad * p.precio_unitario,
    0
  );
  const totalCantidad = products.reduce((s, p) => s + p.cantidad, 0);

  return (
    <div className="panel_ventas">
      <header className="encabezado_panel">
        <div className="encabezado_contenido">
          <h1>Gestión de Inventario</h1>
          <p>Administre los productos y materiales del negocio.</p>
        </div>
        <button className="boton_crear_pedido" onClick={openNew}>
          + Agregar Producto
        </button>
      </header>

      <div className="contenedor_resumen">
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">Total de Productos</div>
          <div className="tarjeta_numero tarjeta_total">{totalProductos}</div>
        </div>
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">Cantidad Total</div>
          <div className="tarjeta_numero">{totalCantidad} u.</div>
        </div>
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">Valor Total</div>
          <div className="tarjeta_numero">Bs {formatMoney(totalInventario)}</div>
        </div>
      </div>

      <div className="contenedor_secciones">
        <section className="tarjeta_tabla">
          <div className="encabezado_tabla">
            <h2 className="titulo_tabla">Productos en Inventario</h2>
          </div>

          {loading ? (
            <p className="texto_cargando">
              Cargando productos del servidor...
            </p>
          ) : products.length === 0 ? (
            <p className="texto_no_encontrado">
              No hay productos en el inventario. ¡Agrega uno para comenzar!
            </p>
          ) : (
            <table className="tabla_pedidos">
              <thead>
                <tr>
                  <th className="tabla_encabezado tabla_encabezado_id">ID</th>
                  <th className="tabla_encabezado tabla_encabezado_cliente">
                    Nombre
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_fecha">
                    Unidad
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_total">
                    <div className="contenedor_header_total">
                      <span>Precio/U.</span>
                      <span className="texto_moneda_secundaria">Bs</span>
                    </div>
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_fecha">
                    Cantidad
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_total">
                    <div className="contenedor_header_total">
                      <span>Total</span>
                      <span className="texto_moneda_secundaria">Bs</span>
                    </div>
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_acciones">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="tabla_fila">
                    <td className="tabla_celda tabla_celda_id">{p.id}</td>
                    <td className="tabla_celda tabla_celda_cliente">
                      {p.nombre}
                    </td>
                    <td className="tabla_celda tabla_celda_fecha">
                      {p.unidad}
                    </td>
                    <td className="tabla_celda tabla_celda_total">
                      {formatMoney(p.precio_unitario)}
                    </td>
                    <td className="tabla_celda tabla_celda_fecha">
                      {p.cantidad}
                    </td>
                    <td className="tabla_celda tabla_celda_total">
                      {formatMoney(p.cantidad * p.precio_unitario)}
                    </td>
                    <td className="tabla_celda tabla_celda_acciones">
                      <div className="contenedor_botones_acciones">
                        <button
                          onClick={() => openEdit(p)}
                          className="boton_modificar"
                        >
                          Modificar
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="boton_cancelar"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {showModal && (
        <div className="superposicion_modal">
          <div className="tarjeta_modal">
            <h3 className="titulo_modal">
              {editing
                ? `Modificar Producto #${editing.id}`
                : "Registrar Nuevo Producto"}
            </h3>

            <div className="contenedor_formulario">
              <div className="grupo_formulario">
                <div className="campo_nombre_cliente">
                  <label className="etiqueta_formulario">
                    Nombre del Producto
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Harina Premium"
                    className="entrada_formulario"
                  />
                </div>

                <div>
                  <label className="etiqueta_formulario">Unidad</label>
                  <input
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    placeholder="Ej. kg, L, paq."
                    className="entrada_formulario"
                  />
                </div>
              </div>

              <div className="grupo_formulario">
                <div>
                  <label className="etiqueta_formulario">
                    Precio Unitario (Bs)
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    value={precio_unitario}
                    onChange={(e) => setPrecio_unitario(Number(e.target.value))}
                    placeholder="Ej. 25.50"
                    className="entrada_formulario"
                  />
                </div>

                <div>
                  <label className="etiqueta_formulario">Cantidad</label>
                  <input
                    type="number"
                    min={0}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    placeholder="Ej. 100"
                    className="entrada_formulario"
                  />
                </div>
              </div>

              {errorMensaje && (
                <div className="mensaje_error">{errorMensaje}</div>
              )}

              <div className="contenedor_resumen_modal">
                <span className="etiqueta_total">Valor Total:</span>
                <strong className="valor_total">
                  Bs {formatMoney(precio_unitario * cantidad)}
                </strong>
              </div>
            </div>

            <div className="contenedor_botones_modal">
              <button
                onClick={() => setShowModal(false)}
                className="boton_cancelar_modal"
              >
                Cancelar
              </button>
              <button
                onClick={submitProduct}
                className="boton_confirmar_modal"
              >
                {editing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
