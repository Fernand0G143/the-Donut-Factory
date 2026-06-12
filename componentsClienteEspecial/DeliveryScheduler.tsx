"use client";
import "./DeliveryScheduler.css";
export default function DeliveryScheduler() {
  return (
    <section className="delivery-card">
      <h2>Programar entrega</h2>
      <div className="input-group">
        <label>Fecha</label>
        <input type="date" className="delivery-input" />
      </div>
      <div className="input-group">
        <label>Hora</label>
        <input type="time" className="delivery-input" />
      </div>
      <div className="input-group">
        <label>Dirección</label>
        <textarea
          className="delivery-textarea"
          placeholder="Escribe la dirección..."
        />
      </div>
    </section>
  );
}
