interface Props {
  title: string;
  value: string;
  className?: string;
}

export default function StatsCard({ title, value, className = "" }: Props) {
  return (
    <div className={`card stats-card ${className}`}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}