interface Props {
  title: string;
  value: string;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}