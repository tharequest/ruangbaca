import Papa from "papaparse";

export type Visit = {
  timestamp: string; // raw timestamp string from the sheet (auto-filled by the form)
  nama: string;
  nim: string;
  tanggal: string; // raw "Tanggal" cell, kept only as a fallback / for display
  tanggalISO: string | null; // normalized YYYY-MM-DD, null if unparseable
  prodi: string;
};

const SHEET_ID = "1iZkRIH6Fcb0H-fANEhSJhF4wo7wi3B_cxeyL-LWEVGM";
const GID = "1142200201";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

/**
 * The visit date is derived from "Timestamp" (the date/time the form entry
 * was recorded, or since Aug 2026 a plain date typed/copied in by hand —
 * still written in M/D/Y order). "Tanggal" is only used as a fallback if
 * Timestamp is ever missing/blank; after the sheet's locale was switched to
 * Indonesia, that column's ARRAYFORMULA renders as D/M/Y instead.
 *
 * When one of the two numbers is >12 we trust that regardless of which
 * column it came from (no 13th+ month exists, so it has to be the day).
 * Only when both numbers are <=12 — genuinely ambiguous — do we fall back
 * to the order that column normally uses.
 *
 * MIN_YEAR / the +1 year ceiling are a safety net against stray typos
 * (e.g. a "2006" instead of "2026").
 */
const MIN_YEAR = 2020;

type DateOrder = "MDY" | "DMY";

function parseSheetDate(raw: string, assumeOrder: DateOrder = "MDY"): string | null {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const [, g1raw, g2raw, y] = match;
  const g1 = Number(g1raw);
  const g2 = Number(g2raw);
  const year = Number(y);
  if (g1 < 1 || g1 > 31 || g2 < 1 || g2 > 31) return null;

  let month: number;
  let day: number;
  if (g1 > 12 && g2 <= 12) {
    // g1 can't be a month -> this is D/M/Y
    day = g1;
    month = g2;
  } else if (g2 > 12 && g1 <= 12) {
    // g2 can't be a month -> this is M/D/Y
    month = g1;
    day = g2;
  } else if (g1 <= 12 && g2 <= 12) {
    // Genuinely ambiguous -> use this column's known order.
    if (assumeOrder === "MDY") {
      month = g1;
      day = g2;
    } else {
      day = g1;
      month = g2;
    }
  } else {
    // Both >12: not a valid date either way.
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (year < MIN_YEAR || year > new Date().getFullYear() + 1) return null;
  const iso = `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  const date = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return null;
  return iso;
}

export async function fetchVisits(): Promise<Visit[]> {
  const res = await fetch(CSV_URL, {
    // Keep data reasonably fresh without hammering Google Sheets on every request.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil data dari Google Sheet (status ${res.status}). Pastikan sheet dibagikan sebagai "Anyone with the link can view".`
    );
  }

  const csvText = await res.text();
  const parsed = Papa.parse<string[]>(csvText.trim(), { skipEmptyLines: true });

  const rows = parsed.data;
  // Row 0 is the header row: Timestamp, Nama, Nim, Tanggal, Kehadiran, Program Studi
  const visits: Visit[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    const [timestamp, nama, nim, tanggal, status, prodi] = row;
    if (!nama && !nim) continue;

    const timestampTrimmed = (timestamp ?? "").trim();
    const tanggalTrimmed = (tanggal ?? "").trim();
    // Prefer the date baked into Timestamp (M/D/Y); fall back to the
    // Tanggal cell (now D/M/Y, since the sheet's locale switched) only if
    // Timestamp is missing or unparseable.
    const tanggalISO =
      (timestampTrimmed ? parseSheetDate(timestampTrimmed, "MDY") : null) ??
      (tanggalTrimmed ? parseSheetDate(tanggalTrimmed, "DMY") : null);

    visits.push({
      timestamp: timestampTrimmed,
      nama: (nama ?? "").trim(),
      nim: (nim ?? "").trim(),
      tanggal: tanggalTrimmed,
      tanggalISO,
      prodi: (prodi ?? "").trim() || "Lainnya",
    });
  }

  return visits;
}
