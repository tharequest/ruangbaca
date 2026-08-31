# Buku Tamu Digital - Dashboard Perpustakaan

Dashboard kunjungan ruang baca/perpustakaan yang datanya **live-sync** langsung dari Google Sheet form presensi (BoloForms Signature), tanpa perlu upload manual.

## Cara kerja

- Sheet diambil lewat endpoint CSV bawaan Google (`/gviz/tq?tqx=out:csv`), server-side di route `app/api/visitors/route.ts` dan langsung di `app/page.tsx`.
- Data di-cache 60 detik (`revalidate: 60`) biar nggak nge-hit Google Sheets tiap kali ada yang buka halaman, tapi tetap kerasa "live". Ada juga tombol stempel "Live Sync" di kanan atas buat refresh manual, dan auto-refresh tiap 60 detik di browser.
- **Syarat penting:** sheet harus di-share sebagai "Anyone with the link — Viewer" (General access), karena endpoint CSV publik ini butuh sheet-nya bisa dibuka tanpa login. Sheet kamu sekarang sudah bisa dibuka tanpa login jadi harusnya sudah aman, tapi double-check di tombol Share kalau data nggak muncul.

## Struktur data yang dibaca

Kolom sheet: `Timestamp, Nama, Nim, Tanggal, Column 4, Column 5 (Hadir), Program Studi`. Parsing ada di `lib/sheets.ts` — kalau kolom di sheet kamu berubah urutan/nama, update di situ.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Ganti sumber data

Kalau sheet-nya beda (ID atau tab berbeda), edit dua konstanta ini di `lib/sheets.ts`:

```ts
const SHEET_ID = "...";
const GID = "...";
```

`GID` bisa dilihat dari angka setelah `#gid=` di URL sheet kamu.

## Deploy

Paling gampang pakai [Vercel](https://vercel.com) (satu ekosistem sama Next.js):

1. Push folder ini ke GitHub repo baru.
2. Import repo di Vercel, framework preset otomatis kedetect Next.js.
3. Deploy — nggak perlu environment variable tambahan karena sheet-nya publik.

## Struktur folder

```
app/
  page.tsx              -> halaman dashboard utama
  api/visitors/route.ts -> endpoint JSON hasil agregasi (opsional, buat dipakai ulang)
  layout.tsx, globals.css
components/
  StatCard.tsx           -> kartu ringkasan gaya "kartu katalog"
  DailyVisitsChart.tsx    -> grafik tren kunjungan harian
  ProdiChart.tsx          -> grafik kunjungan per program studi
  RecentLedger.tsx        -> daftar kunjungan terbaru gaya buku tamu
  SyncStamp.tsx           -> badge stempel live-sync + tombol refresh
lib/
  sheets.ts    -> fetch & parsing CSV dari Google Sheets
  aggregate.ts -> hitung total, tren harian, per-prodi, daftar terbaru
```
