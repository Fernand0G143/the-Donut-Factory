export default function CustomBoxesTable() {
  return (
    <div className="table-card">
      <h2>Cajas personalizadas</h2>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Entrega</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>María Pérez</td>
            <td>12/06/2026</td>
            <td>En producción</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}