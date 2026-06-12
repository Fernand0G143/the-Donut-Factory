"use client";
import "./OrderTracking.css";
const steps = [
  {
    title: "Pedido recibido",
    time: "14:12",
    completed: true,
  },
  {
    title: "En preparación",
    time: "14:25",
    completed: true,
  },
  {
    title: "En camino",
    time: "--",
    completed: false,
  },
  {
    title: "Entregado",
    time: "--",
    completed: false,
  },
];
export default function OrderTracking() {
  return (
    <section className="tracking-card">
      <div className="tracking-header">
        <h3>Llegada estimada:</h3>
        <span>14:45</span>
      </div>
      <div className="tracking-steps">
        {steps.map((step, index) => (
          <div key={index} className="tracking-step">
            <div
              className={`tracking-circle ${step.completed ? "completed" : ""}`}
            />
            <div className="tracking-content">
              <h3>{step.title}</h3>
              <p>{step.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
