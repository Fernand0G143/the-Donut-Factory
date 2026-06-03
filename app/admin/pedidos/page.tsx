"use client";

import { useEffect, useState } from "react";
import "@/styles/dashboard.css";
import "@/styles/tables.css";
import "@/styles/cards.css";
import "@/styles/AdminPedidos.css";

type Item = { sabor: string; units: number; unit_price: number };
type Order = {
  id: number;
  client_name: string;
  created_at: string;
  delivery_at: string;
  status: string;
  total: number;
  telefono?: string;
  items: Item[];
};

const specialCajaOptions = [
  "Añadir caja",
  "Especial Día del Padre",
  "Especial día de la Madre",
  "Especial día del Niño",
];

const formatMoney = (value: any) => {
  const num = Number(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [production, setProduction] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const [selectedSabor, setSelectedSabor] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<number>(0);
  const [deliveryAt, setDeliveryAt] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");

  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [telefono, setTelefono] = useState("");
  const [immediateDelivery, setImmediateDelivery] = useState(false);
  const [hideImmediateCheckboxOnConflict, setHideImmediateCheckboxOnConflict] =
    useState(false);
  const [selectedCajaEspecial, setSelectedCajaEspecial] = useState(
    "Añadir caja",
  );
  const [cajaEspecialUnits, setCajaEspecialUnits] = useState<number>(0);

  async function fetchProductionData() {
    try {
      const res = await fetch("/api/production");
      const data = await res.json();
      const prod = data || [];
      setProduction(prod);
      return prod;
    } catch (e) {
      console.error(e);
      setProduction([]);
      return [];
    }
  }

  useEffect(() => {
    fetchData();
    fetchProductionData().then((prod) => {
      const firstAvailable = prod.find((p: any) => Number(p.disponibles) > 0);
      if (firstAvailable) setSelectedSabor(firstAvailable.sabor);
    });
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function getCurrentDateTimeString() {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  }

  function computeTotal(itms: Item[]) {
    return itms.reduce(
      (s, it) => s + (Number(it.units) || 0) * (Number(it.unit_price) || 0),
      0,
    );
  }

  function openNew() {
    setEditing(null);
    setClientName("");
    setTelefono("");
    setDeliveryAt(getCurrentDateTimeString());
    setImmediateDelivery(false);
    setHideImmediateCheckboxOnConflict(false);
    setSelectedCajaEspecial("Añadir caja");
    setCajaEspecialUnits(0);
    setItems([]);
    if (production.length > 0) {
      const firstAvailable = production.find((p) => Number(p.disponibles) > 0);
      if (firstAvailable) setSelectedSabor(firstAvailable.sabor);
    }
    setSelectedUnits(0);
    setErrorMensaje("");
    setShowModal(true);
  }

  function openEdit(order: Order) {
    setEditing(order);
    setClientName(order.client_name);
    setTelefono(order.telefono || "");
    if (order.delivery_at === "Entrega Inmediata") {
      setImmediateDelivery(true);
      setDeliveryAt(getCurrentDateTimeString());
    } else if (order.delivery_at) {
      const d = new Date(order.delivery_at);
      const tzOffset = d.getTimezoneOffset() * 60000;
      setImmediateDelivery(false);
      setDeliveryAt(
        new Date(d.getTime() - tzOffset).toISOString().slice(0, 16),
      );
    } else {
      setImmediateDelivery(false);
      setDeliveryAt(getCurrentDateTimeString());
    }
    setItems(
      order.items.map((it: any) => ({
        sabor: it.sabor,
        units: Number(it.units),
        unit_price: Number(it.unit_price),
      })),
    );
    setHideImmediateCheckboxOnConflict(false);
    setSelectedCajaEspecial("Añadir caja");
    setCajaEspecialUnits(0);
    if (production.length > 0) {
      const firstAvailable =
        production.find((p) => Number(p.disponibles) > 0) || production[0];
      if (firstAvailable) setSelectedSabor(firstAvailable.sabor);
    }
    setSelectedUnits(0);
    setErrorMensaje("");
    setShowModal(true);
  }

  function handleAddSabor() {
    if (selectedUnits <= 0) {
      alert("Por favor ingrese una cantidad mayor a 0");
      return;
    }

    const prod = production.find((p) => p.sabor === selectedSabor);
    if (!prod) return;

    const available =
      Number(prod.disponibles) > 0
        ? Number(prod.disponibles)
        : Number(prod.producidas);
    if (selectedUnits > available) {
      alert(`No puedes agregar más de la cantidad disponible (${available})`);
      return;
    }

    const existingIndex = items.findIndex((i) => i.sabor === selectedSabor);
    const updatedItems = [...items];

    if (existingIndex > -1) {
      updatedItems[existingIndex] = {
        sabor: selectedSabor,
        units: selectedUnits,
        unit_price: Number(prod.precio),
      };
    } else {
      updatedItems.push({
        sabor: selectedSabor,
        units: selectedUnits,
        unit_price: Number(prod.precio),
      });
    }

    setItems(updatedItems);
    setSelectedUnits(0);
  }

  function handleRemoveSabor(saborToRemove: string) {
    setItems(items.filter((item) => item.sabor !== saborToRemove));
  }

  function handleAddCajaEspecial() {
    if (selectedCajaEspecial === "Añadir caja") {
      alert("Selecciona una caja especial antes de agregar.");
      return;
    }
    if (cajaEspecialUnits <= 0) {
      alert("Ingresa una cantidad válida de cajas.");
      return;
    }

    const existingIndex = items.findIndex(
      (item) => item.sabor === selectedCajaEspecial,
    );
    const updatedItems = [...items];
    const boxItem = {
      sabor: selectedCajaEspecial,
      units: cajaEspecialUnits,
      unit_price: 30,
    };

    if (existingIndex > -1) {
      updatedItems[existingIndex] = boxItem;
    } else {
      updatedItems.push(boxItem);
    }

    setItems(updatedItems);
    setCajaEspecialUnits(0);
    setSelectedCajaEspecial("Añadir caja");

    if (immediateDelivery) {
      setImmediateDelivery(false);
      setHideImmediateCheckboxOnConflict(true);
      setErrorMensaje("");
    }
  }

  async function submitOrder() {
    const fechaEntrega = new Date(deliveryAt);
    const ahora = new Date();
    const specialCajaNames = specialCajaOptions.slice(1);
    const hasSpecialCaja = items.some((item) =>
      specialCajaNames.includes(item.sabor),
    );

    if (!immediateDelivery && fechaEntrega.getTime() < ahora.getTime()) {
      setErrorMensaje(
        "La fecha y hora de entrega debe ser igual o posterior a la fecha y hora actuales.",
      );
      return;
    }

    if (hasSpecialCaja && immediateDelivery) {
      setErrorMensaje(
        "No se permite entrega inmediata con cajas especiales.",
      );
      return;
    }

    if (items.length === 0) {
      setErrorMensaje(
        "Debes agregar al menos un sabor al pedido antes de continuar.",
      );
      return;
    }

    const payload: {
      id?: number;
      client_name: string;
      delivery_at: string;
      items: Item[];
      telefono?: string;
    } = {
      client_name: clientName || "Cliente Anónimo",
      delivery_at: immediateDelivery
        ? "Entrega Inmediata"
        : new Date(deliveryAt).toISOString(),
      items: items,
      telefono: telefono || undefined,
    };

    if (editing) {
      payload.id = editing.id;
    }

    const method = editing ? "PUT" : "POST";
    const res = await fetch("/api/orders", {
      method,
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      await fetchData();
      await fetchProductionData();
      setErrorMensaje("");
      setShowModal(false);
    } else {
      alert("Error al guardar pedido");
    }
  }

  async function updateStatus(id: number, status: string) {
    await fetch("/api/orders", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    await fetchData();
    await fetchProductionData();
  }

  async function wipeAllOrders() {
    const isConfirmed = window.confirm(
      "⚠️ ADVERTENCIA CRÍTICA: Esto ELIMINARÁ TODOS LOS PEDIDOS y reiniciará el ID a #001. ¿Continuar?",
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch("/api/orders", { method: "DELETE" });
      if (res.ok) {
        alert("Sistema limpiado con éxito. El próximo pedido será el #001.");
        await fetchData();
        await fetchProductionData();
      } else {
        const errorText = await res.text();
        console.error("Detalle del error del backend:", errorText);
        alert("Hubo un error al intentar limpiar desde el backend.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al limpiar.");
    }
  }

  function formatId(id: number) {
    return `#${String(id).padStart(3, "0")}`;
  }

  const filtered = orders.filter((o) => {
    if (!o || !o.id) return false;

    if (o.status === "CANCELADO") return false;

    const q = filterText.trim().toLowerCase();
    if (q) {
      const matchId = formatId(o.id).toLowerCase().includes(q);
      const matchClient = (o.client_name || "").toLowerCase().includes(q);
      if (!matchId && !matchClient) return false;
    }

    if (filterDate) {
      const d = new Date(o.created_at).toISOString().slice(0, 10);
      if (d !== filterDate) return false;
    }

    if (filterStatus && o.status !== filterStatus) return false;

    return true;
  });

  const currentSelectedProd = production.find((p) => p.sabor === selectedSabor);
  const currentAvailable = currentSelectedProd
    ? Number(currentSelectedProd.disponibles) > 0
      ? Number(currentSelectedProd.disponibles)
      : Number(currentSelectedProd.producidas)
    : 0;
  const specialCajaNames = specialCajaOptions.slice(1);
  const hasSpecialCaja = items.some((item) =>
    specialCajaNames.includes(item.sabor),
  );
  const hideImmediateCheckbox =
    hideImmediateCheckboxOnConflict && hasSpecialCaja;
  const currentPrice = currentSelectedProd
    ? Number(currentSelectedProd.precio)
    : 0;

  const totalPedidos = orders.filter((o) => o.status !== "CANCELADO").length;
  const pendientesCount = orders.filter((o) => o.status === "PENDIENTE").length;
  const enProduccionCount = orders.filter(
    (o) => o.status === "EN PRODUCCION",
  ).length;
  const entregadosCount = orders.filter((o) => o.status === "ENTREGADO").length;

  const isNameValid = clientName.trim().length > 0;
  const isPhoneValid = telefono.length === 8;
  const hasItems = items.length > 0;
  const isDeliveryValid =
    !!deliveryAt && new Date(deliveryAt).getTime() >= new Date().getTime();
  const canConfirm =
    isNameValid &&
    isPhoneValid &&
    hasItems &&
    (hasSpecialCaja ? isDeliveryValid : immediateDelivery || isDeliveryValid);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipText = !isNameValid
    ? "Completar nombre"
    : !isPhoneValid
    ? "El teléfono debe tener 8 dígitos"
    : !hasItems
    ? "Agregar Productos"
    : !(hasSpecialCaja ? isDeliveryValid : immediateDelivery || isDeliveryValid)
    ? "Elegir Fecha de entrega superior"
    : "";

  return (
    <div className="panel_ventas">
      <header className="encabezado_panel">
        <div className="encabezado_contenido">
          <h1>Gestión de Pedidos</h1>
          <p>
            Administre, filtre y despache pedidos eficientemente en tiempo real.
          </p>
        </div>
        <button className="boton_crear_pedido" onClick={openNew}>
          + Crear Nuevo Pedido
        </button>
      </header>

      <div className="contenedor_resumen">
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">Total de Pedidos</div>
          <div className="tarjeta_numero tarjeta_total">{totalPedidos}</div>
        </div>
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">Pendientes</div>
          <div className="tarjeta_numero">{pendientesCount}</div>
        </div>
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">En producción</div>
          <div className="tarjeta_numero">{enProduccionCount}</div>
        </div>
        <div className="tarjeta_estadistica">
          <div className="tarjeta_etiqueta">Entregados</div>
          <div className="tarjeta_numero">{entregadosCount}</div>
        </div>
      </div>
 
      <div className="contenedor_secciones">
        <section className="tarjeta_tabla">
          <div className="encabezado_tabla">
            <h2 className="titulo_tabla">Listado General de Pedidos</h2>

            <div className="barra_filtros">
              <input
                type="text"
                placeholder="Buscar por cliente o ID..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="entrada_texto_filtro"
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="entrada_fecha_filtro"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="selector_estado_filtro"
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN PRODUCCION">En producción</option>
                <option value="ENTREGADO">Entregado</option>
              </select>

              <button
                onClick={() => {
                  setFilterText("");
                  setFilterDate("");
                  setFilterStatus("");
                }}
                className="boton_limpiar_filtros"
              >
                Limpiar Filtros
              </button>

              <button
                onClick={wipeAllOrders}
                className="boton_borrar_todo"
                title="Elimina todos los pedidos y reinicia el ID"
              >
                Borrar Todo 💥
              </button>
            </div>
          </div>

          {loading ? (
            <p className="texto_cargando">
              Cargando información del servidor...
            </p>
          ) : filtered.length === 0 ? (
            <p className="texto_no_encontrado">
              No se encontraron pedidos activos bajo los criterios de búsqueda.
            </p>
          ) : (
            <table className="tabla_pedidos">
              <thead>
                <tr>
                  <th className="tabla_encabezado tabla_encabezado_id">ID</th>
                  <th className="tabla_encabezado tabla_encabezado_cliente">
                    Cliente
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_fecha">
                    Fecha Registro
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_total">
                    <div className="contenedor_header_total">
                      <span>Total</span>
                      <span className="texto_moneda_secundaria">
                        Bs
                      </span>
                    </div>
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_fecha">
                    Fecha Entrega
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_estado">
                    Estado
                  </th>
                  <th className="tabla_encabezado tabla_encabezado_acciones">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="tabla_fila">
                    <td className="tabla_celda tabla_celda_id">
                      {formatId(o.id)}
                    </td>
                    <td className="tabla_celda tabla_celda_cliente">
                      {o.client_name}
                    </td>
                    <td className="tabla_celda tabla_celda_fecha">
                      {o.created_at ? (
                        <div className="contenedor_fecha_hora">
                          <span className="texto_fecha">
                            {new Date(o.created_at).toLocaleDateString()}
                          </span>
                          <span className="texto_hora">
                            {new Date(o.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="texto_indefinido">No definida</span>
                      )}
                    </td>
                    <td className="tabla_celda tabla_celda_total">
                      {formatMoney(o.total)}
                    </td>
                    <td className="tabla_celda tabla_celda_fecha">
                      {o.delivery_at ? (
                        isNaN(Date.parse(o.delivery_at)) ? (
                          <span
                            className={
                              o.delivery_at === "Entrega Inmediata" &&
                              o.items?.some((item: any) =>
                                specialCajaNames.includes(item.sabor),
                              )
                                ? "texto_entrega_inmediata_especial"
                                : undefined
                            }
                          >
                            {o.delivery_at}
                          </span>
                        ) : (
                          <div className="contenedor_fecha_hora">
                            <span className="texto_fecha">
                              {new Date(o.delivery_at).toLocaleDateString()}
                            </span>
                            <span className="texto_hora">
                              {new Date(o.delivery_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )
                      ) : (
                        <span className="texto_indefinido">No definida</span>
                      )}
                    </td>
                    <td className="tabla_celda tabla_celda_estado">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="selector_estado"
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN PRODUCCION">En producción</option>
                        <option value="ENTREGADO">Entregado</option>
                      </select>
                    </td>
                    <td className="tabla_celda tabla_celda_acciones">
                      {o.status !== "ENTREGADO" && o.status !== "CANCELADO" ? (
                        <div className="contenedor_botones_acciones">
                          <button
                            onClick={() => openEdit(o)}
                            className="boton_modificar"
                          >
                            Modificar
                          </button>
                          <button
                            onClick={() => updateStatus(o.id, "CANCELADO")}
                            className="boton_cancelar"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : o.status === "ENTREGADO" ? (
                        <span className="texto_estado_entregado">
                          ✓ Entregado
                        </span>
                      ) : (
                        <span className="texto_estado_cancelado">
                          ✕ Cancelado
                        </span>
                      )}
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
                ? `Modificar Pedido ${formatId(editing.id)}`
                : "Registrar Nuevo Pedido"}
            </h3>

            <div className="contenedor_formulario">
              <div className="grupo_formulario">
                <div className="campo_nombre_cliente">
                  <label className="etiqueta_formulario">
                    Nombre del Cliente
                  </label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="entrada_formulario"
                  />
                </div>

                <div>
                  <label className="etiqueta_formulario">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={telefono}
                    placeholder="Ej. 79548420"
                    className="entrada_formulario"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                      setTelefono(val);
                    }}
                  />
                </div>
              </div>
              {!hideImmediateCheckbox && (
                <div className="contenedor_checkbox_inmediata">
                  <label
                    className={`checkbox_label ${
                      hasSpecialCaja ? "checkbox_label_disabled" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={immediateDelivery}
                      disabled={hasSpecialCaja}
                      className="entrada_checkbox"
                      onChange={(e) => {
                        setImmediateDelivery(e.target.checked);
                        setErrorMensaje("");
                      }}
                    />
                    Entrega Inmediata
                  </label>
                </div>
              )}

              {(!immediateDelivery || hasSpecialCaja) && (
                <div className="grupo_formulario">
                  <label className="etiqueta_formulario">
                    Fecha y Hora de Entrega
                  </label>
                  <input
                    type="datetime-local"
                    value={deliveryAt}
                    onChange={(e) => {
                      setDeliveryAt(e.target.value);
                      setErrorMensaje("");
                    }}
                    required
                    className="entrada_formulario"
                  />
                </div>
              )}

              {errorMensaje && (
                <div className="mensaje_error">{errorMensaje}</div>
              )}
            </div>

            <div className="contenedor_seleccion_productos">

              <div className="grid_seleccion">
                <div>
                  <label className="etiqueta_formulario">Sabor de Donas</label>
                  <select
                    value={selectedSabor}
                    onChange={(e) => {
                      setSelectedSabor(e.target.value);
                      setSelectedUnits(0);
                    }}
                    className="selector_sabor"
                  >
                    {production.map((p) => {
                      const shown =
                        Number(p.disponibles) > 0
                          ? Number(p.disponibles)
                          : Number(p.producidas);
                      return (
                        <option
                          key={p.sabor}
                          value={p.sabor}
                          disabled={Number(p.producidas) <= 0}
                        >
                          {p.sabor} ({shown} disp.)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="etiqueta_formulario">Cantidad</label>
                  <input
                    type="number"
                    min={0}
                    max={currentAvailable}
                    value={selectedUnits}
                    onChange={(e) => setSelectedUnits(Number(e.target.value))}
                    className="entrada_cantidad"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddSabor}
                  className="boton_agregar"
                >
                  Agregar
                </button>
              </div>

              <div className="info_disponibilidad">
                <span>
                  Disponibles: <strong>{currentAvailable} u.</strong>
                </span>
                <span>
                  Precio Unitario: <strong>Bs {formatMoney(currentPrice)}</strong>
                </span>
              </div>

              <div className="contenedor_cajas_especiales">
                <div className="fila_cajas">
                  <div>
                    <label className="etiqueta_formulario">
                      Cajas especiales
                    </label>
                    <select
                      value={selectedCajaEspecial}
                      onChange={(e) => {
                        setSelectedCajaEspecial(e.target.value);
                        setCajaEspecialUnits(0);
                      }}
                      className="selector_caja_especial"
                    >
                      {specialCajaOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="etiqueta_formulario">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={cajaEspecialUnits}
                      disabled={selectedCajaEspecial === "Añadir caja"}
                      onChange={(e) =>
                        setCajaEspecialUnits(Number(e.target.value))
                      }
                      className="entrada_caja_numero"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCajaEspecial}
                    className="boton_agregar_caja"
                  >
                    Agregar caja
                  </button>
                </div>
                <p className="descripcion_caja">
                  6 unidades, precio de caja 30bs
                </p>
              </div>
            </div>

            <div className="contenedor_tabla_items">
              <table className="tabla_items">
                <thead>
                  <tr>
                    <th>Sabor</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th>Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="mensaje_sin_items">
                        Ningún sabor añadido todavía.
                      </td>
                    </tr>
                  ) : (
                    items.map((it) => (
                      <tr key={it.sabor}>
                        <td className="celda_sabor">{it.sabor}</td>
                        <td className="celda_cantidad">{it.units}</td>
                        <td className="celda_precio">
                          Bs {formatMoney(it.unit_price)}
                        </td>
                        <td className="celda_subtotal">
                          Bs {formatMoney(it.units * it.unit_price)}
                        </td>

                        <td className="celda_acciones">
                          <button
                            type="button"
                            onClick={() => handleRemoveSabor(it.sabor)}
                            className="boton_quitar"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="contenedor_resumen_modal">
              <span className="etiqueta_total">Total del Pedido:</span>
              <strong className="valor_total">
                Bs {formatMoney(computeTotal(items))}
              </strong>
            </div>

            <div className="contenedor_botones_modal">
              <button
                onClick={() => setShowModal(false)}
                className="boton_cancelar_modal"
              >
                Cancelar
              </button>
              <div
                className="tooltip_wrapper"
                onMouseEnter={() => {
                  if (!canConfirm && tooltipText) setShowTooltip(true);
                }}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button
                  onClick={submitOrder}
                  className="boton_confirmar"
                  disabled={!canConfirm}
                >
                  {editing ? "Guardar Cambios" : "Confirmar Pedido"}
                </button>

                {!canConfirm && showTooltip && tooltipText && (
                  <div className="tooltip_text">{tooltipText}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}