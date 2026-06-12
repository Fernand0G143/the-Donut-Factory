"use client";
import "./DonutCard.css";
interface DonutCardProps {
  image: string;
  title: string;
  price: string;
}
export default function DonutCard({ image, title, price }: DonutCardProps) {
  return (
    <div className="donut-card">
      <div className="donut-image-wrapper">
        <img src={image} alt={title} className="donut-image" />
      </div>
      <div className="donut-content">
        <h3>{title}</h3>
        <p>{price}</p>
      </div>
    </div>
  );
}
