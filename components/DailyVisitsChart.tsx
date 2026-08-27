"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyCount, MonthlyCount } from "@/lib/aggregate";

type ChartType = "area" | "line" | "bar";
type Period = "harian" | "bulanan";

const CHART_OPTIONS: { value: ChartType; label: string }[] = [
  { value: "area", label: "Grafik Area" },
  { value: "line", label: "Grafik Garis" },
  { value: "bar", label: "Grafik Batang" },
];

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "harian", label: "Harian" },
  { value: "bulanan", label: "Bulanan" },
];

function formatDateLabel(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

function formatMonthLabel(month: string) {
  // month = "YYYY-MM"
  const d = new Date(month + "-01T00:00:00Z");
  if (Number.isNaN(d.getTime())) return month;
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

const tooltipStyle = {
  contentStyle: {
    background: "#FBF7EC",
    border: "1px solid #1F3B2C33",
    borderRadius: 2,
    fontSize: 12,
    fontFamily: "inherit",
  },
  labelStyle: { color: "#1B2233", fontWeight: 600 },
  formatter: (value: number) => [`${value} kunjungan`, ""] as [string, string],
};

const axisProps = {
  x: {
    tick: { fontSize: 11, fill: "#1B2233" },
    axisLine: { stroke: "#1B223330" },
    tickLine: false,
    interval: "preserveStartEnd" as const,
  },
  y: {
    allowDecimals: false,
    tick: { fontSize: 11, fill: "#1B2233" },
    axisLine: false,
    tickLine: false,
    width: 28,
  },
};

function DropdownMenu<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value)!;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-sm border border-ledger/25 bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ledger transition hover:border-ledger/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 3l4 4 4-4" stroke="#1F3B2C" strokeWidth="1.4" fill="none" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-sm border border-ledger/25 bg-card shadow-card"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.1em] transition hover:bg-ledger/10 ${
                  opt.value === value ? "bg-ledger/10 text-ledger" : "text-ink/70"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DailyVisitsChart({
  daily,
  monthly,
}: {
  daily: DailyCount[];
  monthly: MonthlyCount[];
}) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [period, setPeriod] = useState<Period>("harian");

  const chartData = useMemo(() => {
    if (period === "harian") {
      return daily.map((d) => ({ label: formatDateLabel(d.date), count: d.count }));
    }
    return monthly.map((m) => ({ label: formatMonthLabel(m.month), count: m.count }));
  }, [period, daily, monthly]);

  if (daily.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink/50">
        Belum ada data tanggal kunjungan yang bisa dibaca.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        <DropdownMenu value={period} options={PERIOD_OPTIONS} onChange={setPeriod} />
        <DropdownMenu value={chartType} options={CHART_OPTIONS} onChange={setChartType} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        {chartType === "area" ? (
          <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="ledgerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F3B2C" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#1F3B2C" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" stroke="#1B223320" vertical={false} />
            <XAxis dataKey="label" {...axisProps.x} />
            <YAxis {...axisProps.y} />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1F3B2C"
              strokeWidth={2}
              fill="url(#ledgerFill)"
            />
          </AreaChart>
        ) : chartType === "line" ? (
          <LineChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 5" stroke="#1B223320" vertical={false} />
            <XAxis dataKey="label" {...axisProps.x} />
            <YAxis {...axisProps.y} />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1F3B2C"
              strokeWidth={2}
              dot={{ r: 2.5, fill: "#1F3B2C" }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 5" stroke="#1B223320" vertical={false} />
            <XAxis dataKey="label" {...axisProps.x} />
            <YAxis {...axisProps.y} />
            <Tooltip {...tooltipStyle} cursor={{ fill: "#1F3B2C0d" }} />
            <Bar dataKey="count" fill="#1F3B2C" radius={[2, 2, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
