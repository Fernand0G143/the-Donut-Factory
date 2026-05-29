export default function CustomerHistory() {
  return (
    <div className="table-card">
      <h2>Historial de clientes</h2>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Favorito</th>
            <th>Compras</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Carlos Rojas</td>
            <td>Chocolate</td>
            <td>15</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}