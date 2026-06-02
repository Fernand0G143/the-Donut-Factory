interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function TableCard({ className = "", children }: Props) {
  return <section className={`table-card ${className}`}>{children}</section>;
}
