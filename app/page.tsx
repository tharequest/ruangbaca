import { fetchVisits } from "@/lib/sheets";
import { summarize } from "@/lib/aggregate";
import StatCard from "@/components/StatCard";
import DailyVisitsChart from "@/components/DailyVisitsChart";
import ProdiChart from "@/components/ProdiChart";
import RecentLedger from "@/components/RecentLedger";
import SyncStamp from "@/components/SyncStamp";

export const revalidate = 60;

export default async function DashboardPage() {
  let errorMessage: string | null = null;
  let summary = summarize([]);

  try {
    const visits = await fetchVisits();
    summary = summarize(visits);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Gagal memuat data.";
  }

  const busiestDay = [...summary.dailyCounts].sort((a, b) => b.count - a.count)[0];

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 sm:px-8">
      <header className="mb-10 flex flex-col gap-4 border-b-2 border-ledger/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <img
            src="/logo.png"
            alt="Logo Tut Wuri Handayani, Universitas Tanjungpura, dan Diktisaintek Berdampak"
            className="mb-4 h-14 w-auto object-contain"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass">
            Ruang Baca &middot; FMIPA UNTAN
          </p>
          <h1 className="mt-2 font-display text-3xl text-ledger sm:text-4xl">
            Buku Tamu Digital
          </h1>
          <p className="mt-2 max-w-md text-sm text-ink/60">
            Rekap kunjungan ruang baca, tersinkron langsung dari database
            presensi.
          </p>
        </div>
        <SyncStamp updatedAt={summary.updatedAt} />
      </header>

      {errorMessage && (
        <div className="mb-8 rounded-sm border border-stamp/40 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {errorMessage}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          index="No. 01"
          label="Total Kunjungan"
          value={summary.totalKunjungan}
          caption="Sepanjang data tercatat"
        />
        <StatCard
          index="No. 02"
          label="Pengunjung Unik"
          value={summary.totalPengunjungUnik}
          caption="Jumlah orang berbeda (dihitung dari NIM, sekali per orang)"
        />
        <StatCard
          index="No. 03"
          label="Hari Tersibuk"
          value={busiestDay ? busiestDay.count : "—"}
          caption={
            busiestDay
              ? new Date(busiestDay.date + "T00:00:00Z").toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Belum ada data"
          }
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-sm border border-ledger/20 bg-card p-5 shadow-card lg:col-span-3">
          <h2 className="font-display text-lg text-ledger">Tren Kunjungan</h2>
          <p className="mt-1 text-xs text-ink/50">
            Jumlah kunjungan per tanggal atau per bulan, berdasarkan kolom
            Tanggal di database. Pilih periode &amp; tipe grafik di kanan atas.
          </p>
          <div className="mt-4">
            <DailyVisitsChart daily={summary.dailyCounts} monthly={summary.monthlyCounts} />
          </div>
        </div>

        <div className="rounded-sm border border-ledger/20 bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="font-display text-lg text-ledger">Kunjungan per Program Studi</h2>
          <p className="mt-1 text-xs text-ink/50">
            Prodi dengan kunjungan terbanyak ke ruang baca.
          </p>
          <div className="mt-4">
            <ProdiChart data={summary.prodiCounts} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-sm border border-ledger/20 bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ledger">Catatan Terbaru</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
            15 kunjungan terakhir
          </span>
        </div>
        <div className="mt-3">
          <RecentLedger visits={summary.recent} />
        </div>
      </section>

      <footer className="mt-10 pb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink/35">
        Data diambil langsung dari database presensi &middot; diperbarui otomatis tiap 60 detik
      </footer>
    </main>
  );
}
