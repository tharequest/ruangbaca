type StatCardProps = {
  index: string;
  label: string;
  value: string | number;
  caption: string;
};

export default function StatCard({ index, label, value, caption }: StatCardProps) {
  return (
    <div className="relative rounded-sm border border-ledger/20 bg-card px-6 pb-6 pt-5 shadow-card">
      <div className="absolute -top-2 left-6 h-4 w-4 rounded-full border border-ledger/30 bg-paper" />
      <div className="flex items-baseline justify-between border-b border-dashed border-ledger/25 pb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ledger/60">
          {index}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
          kartu informasi
        </span>
      </div>
      <p className="mt-4 font-display text-4xl leading-none text-ledger">{value}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink/80">
        {label}
      </p>
      <p className="mt-1 text-xs text-ink/50">{caption}</p>
    </div>
  );
}
