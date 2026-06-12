"use client";
import "./OrderSummary.css";
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}
const products: Product[] = [
  {
    id: 1,
    name: "Explosión de Fresa",
    description: "Chocolate blanco y relleno cremoso",
    price: "Bs4.50",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
  },
  {
    id: 2,
    name: "Delicia de Cacao",
    description: "Chocolate oscuro y avellanas",
    price: "Bs4.75",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
  },
];
export default function OrderSummary() {
  return (
    <section className="summary-card">
      <h2>Resumen del pedido</h2>
      <div className="summary-products">
        {products.map((product) => (
          <div key={product.id} className="summary-product">
            <img src={product.image} alt={product.name} />
            <div className="summary-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span>{product.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="summary-total">
        <div>
          <span>Subtotal</span>
          <strong>Bs9.25</strong>
        </div>
        <div>
          <span>Delivery</span>
          <strong>Bs2.50</strong>
        </div>
        <div className="grand-total">
          <h2>Total</h2>
          <strong>Bs11.75</strong>
        </div>
      </div>
    </section>
  );
}
