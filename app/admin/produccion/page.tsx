"use client";

import { useEffect, useState } from "react";

import "@/app/globals.css";

type Production = {
  sabor: string;
  producidas: number;
  vendidas: number;
  precio: number;
  disponibles: number;
};

export default function ProductionPage() {
  const [production, setProduction] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Production | null>(null);
  const [deletedFlavor, setDeletedFlavor] = useState<string | null>(null);
  const [formSabor, setFormSabor] = useState("");
  const [formProducidas, setFormProducidas] = useState<number>(0);
  const [formPrecio, setFormPrecio] = useState<number>(0);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [successMensaje, setSuccessMensaje] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSabor, setAddSabor] = useState("");
  const [addProducidas, setAddProducidas] = useState<number>(0);
  const [addPrecio, setAddPrecio] = useState<number>(0);

  useEffect(() => {
    fetchProduction();
  }, []);

  async function fetchProduction() {
    setLoading(true);
    try {
      const res = await fetch("/api/production");
      const data = await res.json();
      setProduction(data || []);
    } catch (error) {
      console.error(error);
      setErrorMensaje("No se pudo cargar la producción. Intente de nuevo.");
    }
    setLoading(false);
  }

  function openEdit(item: Production) {
    setEditing(item);
    setFormSabor(item.sabor);
    setFormProducidas(item.producidas);
    setFormPrecio(item.precio);
    setErrorMensaje("");
    setSuccessMensaje("");
  }

  function closeEdit() {
    setEditing(null);
    setErrorMensaje("");
    setSuccessMensaje("");
  }

  async function saveEdit() {
    if (!editing) return;
    if (!formSabor.trim()) {
      setErrorMensaje("El nombre del sabor no puede quedar vacío.");
      return;
    }
    if (formProducidas < 0) {
      setErrorMensaje("La cantidad producida debe ser un número positivo.");
      return;
    }
    if (formPrecio < 0) {
      setErrorMensaje("El precio debe ser un valor positivo.");
      return;
    }

    try {
      const res = await fetch("/api/production", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_sabor: editing.sabor,
          sabor: formSabor.trim(),
          producidas: formProducidas,
          precio: formPrecio,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Error al actualizar producción.");
      }

      setSuccessMensaje("Inventario del sabor actualizado correctamente.");
      closeEdit();
      await fetchProduction();
    } catch (error) {
      console.error(error);
      setErrorMensaje((error as Error).message || "Error al guardar cambios.");
    }
  }

  async function deleteFlavor(sabor: string) {
    const confirmacion = window.confirm(`¿Eliminar sabor ${sabor}? Esta acción no se puede deshacer.`);
    if (!confirmacion) return;

    try {
      const res = await fetch("/api/production", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sabor }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Error al eliminar sabor.");
      }
      setSuccessMensaje(`Sabor ${sabor} eliminado correctamente.`);
      setDeletedFlavor(sabor);
      await fetchProduction();
    } catch (error) {
      console.error(error);
      setErrorMensaje((error as Error).message || "Error al eliminar sabor.");
    }
  }
  
  return (
    <div className="panel">
      <header className="encabezado_panel">
        <div className="encabezado_contenido">
          <h1>Producción por sabor de donas</h1>
          <p >
            Cantidad producida, disponibles y vendidas por sabor, con precio de venta.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="boton_agregar_sabor" onClick={() => { setShowAddModal(true); setAddSabor(''); setAddProducidas(0); setAddPrecio(0); setErrorMensaje(''); setSuccessMensaje(''); }}>
            + Añadir nuevo sabor
          </button>
        </div>
      </header>

      {errorMensaje && <div className="error_produccion">{errorMensaje}</div>}
      {successMensaje && <div className="exito_produccion">{successMensaje}</div>}

      <div className="production-table-wrapper">
        <table className="production-table">
          <thead>
            <tr>
              <th>Sabor</th>
              <th>U. producidas</th>
              <th>U. disponibles</th>
              <th>U. vendidas</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "18px" }}>Cargando producción...</td>
              </tr>
            ) : production.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "18px" }}>No hay sabores registrados.</td>
              </tr>
            ) : (
              production.map((item) => (
                <tr key={item.sabor}>
                  <td>{item.sabor}</td>
                  <td>{item.producidas}</td>
                  <td>{item.disponibles}</td>
                  <td>{item.vendidas}</td>
                  <td>Bs {item.precio}</td>
                  <td className="production-actions">
                    <button className="boton_produccion_modificar" onClick={() => openEdit(item)}>
                      Modificar
                    </button>
                    <button className="boton_produccion_eliminar" onClick={() => deleteFlavor(item.sabor)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal_produccion_overlay">
          <div className="modal_produccion">
            <h2>Modificar sabor</h2>
            <div className="modal_produccion_form">
              <div>
                <label className="modal_produccion_label">Nombre del sabor</label>
                <input
                  value={formSabor}
                  onChange={(e) => setFormSabor(e.target.value)}
                  className="modal_produccion_input"
                />
              </div>
              <div>
                <label className="modal_produccion_label">U. producidas</label>
                <input
                  type="number"
                  min={0}
                  value={formProducidas}
                  onChange={(e) => setFormProducidas(Number(e.target.value))}
                  className="modal_produccion_input"
                />
              </div>
              <div>
                <label className="modal_produccion_label">Precio de venta</label>
                <input
                  type="number"
                  min={0}
                  value={formPrecio}
                  onChange={(e) => setFormPrecio(Number(e.target.value))}
                  className="modal_produccion_input"
                />
              </div>
            </div>
            <div className="modal_produccion_buttons">
              <button className="boton_modal_cancelar" onClick={closeEdit}>
                Cancelar
              </button>
              <button className="boton_modal_guardar" onClick={saveEdit}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal_produccion_overlay">
          <div className="modal_produccion">
            <h2>Agregar nuevo sabor</h2>
            <div className="modal_produccion_form">
              <div>
                <label className="modal_produccion_label">Nombre del sabor</label>
                <input
                  value={addSabor}
                  onChange={(e) => setAddSabor(e.target.value)}
                  className="modal_produccion_input"
                />
              </div>

              <div>
                <label className="modal_produccion_label">U. producidas</label>
                <input
                  type="number"
                  min={0}
                  value={addProducidas}
                  onChange={(e) => setAddProducidas(Number(e.target.value))}
                  className="modal_produccion_input"
                />
              </div>

              <div>
                <label className="modal_produccion_label">Precio de venta</label>
                <input
                  type="number"
                  min={0}
                  value={addPrecio}
                  onChange={(e) => setAddPrecio(Number(e.target.value))}
                  className="modal_produccion_input"
                />
              </div>
            </div>

            <div className="modal_produccion_buttons">
              <button
                className="boton_modal_cancelar"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>

              <button
                className="boton_modal_guardar"
                onClick={async () => {
                  if (!addSabor.trim()) {
                    alert("El nombre del sabor es obligatorio.");
                    return;
                  }

                  if (!addPrecio || Number(addPrecio) <= 0) {
                    alert("El precio es obligatorio.");
                    return;
                  }

                  try {
                    const res = await fetch("/api/production", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        sabor: addSabor.trim(),
                        producidas: Number(addProducidas || 0),
                        precio: Number(addPrecio),
                      }),
                    });

                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(
                        data?.error || "Error al crear sabor."
                      );
                    }

                    const created = await res.json();
                    setProduction((prev) => [...prev, created]);
                    alert(`Sabor ${created.sabor} agregado correctamente.`);
                    setShowAddModal(false);
                    setAddSabor("");
                    setAddProducidas(0);
                    setAddPrecio(0);
                  } catch (err) {
                    console.error(err);
                    alert(
                      (err as Error).message ||
                      "Error al crear sabor."
                    );
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {deletedFlavor && (
        <div className="modal_produccion_overlay">
          <div className="modal_produccion">
            <h2>{`Sabor ${deletedFlavor} eliminado correctamente.`}</h2>
            <div className="modal_produccion_buttons">
              <button
                className="boton_modal_guardar"
                onClick={() => {
                  setDeletedFlavor(null);
                  window.location.reload();
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
