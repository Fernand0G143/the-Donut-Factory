export default function SpecialDatesFilter() {
  return (
    <div className="table-card">
      <h2>Clientes con fechas especiales</h2>

      <div className="filter-bar">
        <input
          type="date"
        />

        <button>
          Filtrar
        </button>
      </div>

      <ul>
        <li>Andrea — Cumpleaños 15/06</li>
        <li>José — Aniversario 18/06</li>
      </ul>
    </div>
  );
}