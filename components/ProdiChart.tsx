"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { ProdiCount } from "@/lib/aggregate";

const PALETTE = ["#1F3B2C", "#2E5240", "#B08A4E", "#A63D2F", "#4A5D45", "#8C6A3A", "#6B7A5E", "#9C7A4A"];

type ChartType = "bar" | "pie";
const CHART_OPTIONS: { value: ChartType; label: string }[] = [
  { value: "bar", label: "Grafik Batang" },
  { value: "pie", label: "Grafik Lingkaran" },
];

function ChartTypeMenu({
  value,
  onChange,
}: {
  value: ChartType;
  onChange: (v: ChartType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = CHART_OPTIONS.find((o) => o.value === value)!;

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
          className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-sm border border-ledger/25 bg-card shadow-card"
        >
          {CHART_OPTIONS.map((opt) => (
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

export default function ProdiChart({ data }: { data: ProdiCount[] }) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink/50">
        Belum ada data program studi.
      </div>
    );
  }

  const chartData = data.slice(0, 8);
  const height = chartType === "bar" ? Math.max(220, chartData.length * 38) : 280;

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <ChartTypeMenu value={chartType} onChange={setChartType} />
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {chartType === "bar" ? (
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 5" stroke="#1B223320" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#1B2233" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="prodi"
              width={150}
              tick={{ fontSize: 11, fill: "#1B2233" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#FBF7EC",
                border: "1px solid #1F3B2C33",
                borderRadius: 2,
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value} kunjungan`, ""]}
              cursor={{ fill: "#1F3B2C0d" }}
            />
            <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={16}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <Tooltip
              contentStyle={{
                background: "#FBF7EC",
                border: "1px solid #1F3B2C33",
                borderRadius: 2,
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value} kunjungan`, ""]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "inherit" }}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="prodi"
              cx="38%"
              cy="50%"
              outerRadius={90}
              paddingAngle={1.5}
              stroke="#F3EEDF"
              strokeWidth={2}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
