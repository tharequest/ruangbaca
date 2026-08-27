"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 5) return "baru saja";
  if (seconds < 60) return `${seconds} detik lalu`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} menit lalu`;
}

export default function SyncStamp({ updatedAt }: { updatedAt: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, forceTick] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => forceTick((n) => n + 1), 5000);
    const autoRefresh = setInterval(() => startTransition(() => router.refresh()), 60000);
    return () => {
      clearInterval(tick);
      clearInterval(autoRefresh);
    };
  }, [router]);

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      className="group flex -rotate-3 items-center gap-2 rounded-sm border-2 border-stamp/70 px-3 py-1.5 text-stamp transition hover:rotate-0"
      title="Klik untuk sinkron ulang sekarang"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
        {isPending ? "Menyinkron…" : "Live Sync"}
      </span>
      <span className="h-1 w-1 rounded-full bg-stamp/70 group-hover:animate-pulse" />
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-stamp/70">
        {timeAgo(updatedAt)}
      </span>
    </button>
  );
}
