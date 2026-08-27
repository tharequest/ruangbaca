import type { RecentVisit } from "@/lib/aggregate";

function formatTanggal(value: string) {
  const d = new Date(value + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RecentLedger({ visits }: { visits: RecentVisit[] }) {
  if (visits.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink/50">
        Belum ada catatan kunjungan.
      </p>
    );
  }

  return (
    <div className="ruled">
      {visits.map((v, i) => (
        <div
          key={`${v.nim}-${i}`}
          className="flex items-center justify-between gap-4 py-[7px] text-sm"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{v.nama || "—"}</p>
            <p className="truncate font-mono text-[11px] text-ink/50">
              {v.nim || "NIM tidak diisi"} &middot; {v.prodi}
            </p>
          </div>
          <span className="shrink-0 font-mono text-[11px] text-ledger/70">
            {formatTanggal(v.tanggal)}
          </span>
        </div>
      ))}
    </div>
  );
}
