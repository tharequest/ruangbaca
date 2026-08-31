import QRCode from "qrcode";

const FORM_URL = "https://forms.gle/rRUPeJ2CVSmx72f28";

export default async function AttendanceQR() {
  const svg = await QRCode.toString(FORM_URL, {
    type: "svg",
    margin: 0,
    color: {
      dark: "#1F3B2C",
      light: "#00000000", // transparent background
    },
  });

  return (
    <div className="mb-6 rounded-sm border border-ledger/20 bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
        <div
          className="h-40 w-40 shrink-0 rounded-sm border border-ledger/15 bg-white p-2 sm:h-48 sm:w-48"
          // Generated server-side from a fixed, trusted Google Form URL above.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="text-center sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass">
            Presensi Kunjungan
          </p>
          <h2 className="mt-1 font-display text-2xl text-ledger sm:text-3xl">
            Scan untuk absen
          </h2>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Arahkan kamera HP kamu ke kode QR ini buat isi form kehadiran
            ruang baca.
          </p>
        </div>
      </div>
    </div>
  );
}
