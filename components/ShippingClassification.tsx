export default function ShippingClassification() {
  return (
    <div className="table-card">
      <h2>Clasificación de envíos</h2>

      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Volumen</th>
            <th>Transporte</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>#458</td>
            <td>Grande</td>
            <td>Vehículo refrigerado</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}