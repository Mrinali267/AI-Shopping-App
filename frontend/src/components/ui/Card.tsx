export function Card({
  children,
  className = "",
  ...rest
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-[0_8px_30px_-24px_rgba(20,12,18,0.35)] transition-all duration-200 hover:border-accent/35 hover:shadow-elevated ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-start justify-between border-b border-line px-5 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-sm font-semibold tracking-tight text-ink ${className}`}>{children}</h2>;
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-1 text-sm text-ink-soft ${className}`}>{children}</p>;
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
