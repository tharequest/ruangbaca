import type { Metadata } from "next";
import "./globals.css";
import PencilCursor from "@/components/PencilCursor";

export const metadata: Metadata = {
  title: "Buku Tamu — Ruang Baca FMIPA UNTAN",
  description:
    "Dashboard kunjungan Ruang Baca FMIPA UNTAN, tersinkron langsung dari Google Sheet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <PencilCursor />
        {children}
      </body>
    </html>
  );
}
