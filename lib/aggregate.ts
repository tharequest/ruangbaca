import type { Visit } from "./sheets";

export type DailyCount = { date: string; count: number };
export type MonthlyCount = { month: string; count: number }; // month = "YYYY-MM"
export type ProdiCount = { prodi: string; count: number };
export type RecentVisit = {
  nama: string;
  nim: string;
  prodi: string;
  tanggal: string;
};

export type VisitorSummary = {
  totalKunjungan: number;
  totalPengunjungUnik: number;
  totalProdi: number;
  dailyCounts: DailyCount[];
  monthlyCounts: MonthlyCount[];
  prodiCounts: ProdiCount[];
  recent: RecentVisit[];
  updatedAt: string;
};

export function summarize(visits: Visit[]): VisitorSummary {
  const byDate = new Map<string, number>();
  const byMonth = new Map<string, number>();
  const byProdi = new Map<string, number>();
  const visitorNims = new Set<string>();

  for (const v of visits) {
    if (v.tanggalISO) {
      byDate.set(v.tanggalISO, (byDate.get(v.tanggalISO) ?? 0) + 1);
      const month = v.tanggalISO.slice(0, 7); // "YYYY-MM"
      byMonth.set(month, (byMonth.get(month) ?? 0) + 1);
    }
    byProdi.set(v.prodi, (byProdi.get(v.prodi) ?? 0) + 1);
    if (v.nim) visitorNims.add(v.nim.toLowerCase());
  }

  const dailyCounts = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const monthlyCounts = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const prodiCounts = Array.from(byProdi.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([prodi, count]) => ({ prodi, count }));

  const recent = [...visits]
    .reverse()
    .slice(0, 15)
    .map((v) => ({
      nama: v.nama,
      nim: v.nim,
      prodi: v.prodi,
      tanggal: v.tanggalISO ?? v.tanggal,
    }));

  return {
    totalKunjungan: visits.length,
    totalPengunjungUnik: visitorNims.size,
    totalProdi: byProdi.size,
    dailyCounts,
    monthlyCounts,
    prodiCounts,
    recent,
    updatedAt: new Date().toISOString(),
  };
}
