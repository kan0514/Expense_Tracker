"use client";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  Bar,
} from "recharts";

type Tx = {
  id?: string;
  amount?: number;
  type?: string;
  createdAt?: string;
  category?: { name?: string };
};

export default function SpendChart({ data }: { data?: Tx[] }) {
  const chartData = useMemo(() => {
    console.log("🔵 RAW data received:", data);

    const txs = Array.isArray(data) ? data.slice() : [];
    console.log("🔵 Copied array:", txs);

    const recent = txs
      .filter(t => {
        const keep = t && typeof t.amount === "number";
        if (!keep) console.log("❌ Filtered out item:", t);
        return keep;
      })
      .sort((a: any, b: any) => {
        const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return ta - tb;
      })
      .slice(-10);

    console.log("🟡 After sorting (oldest → newest):");
    recent.forEach((t, i) =>
      console.log(
        `${i + 1}. ${t.type} | ₹${t.amount} | ${t.createdAt}`
      )
    );

    if (recent.length === 0) return [];

    let running = 0;
    const chart = recent.map((t: any, idx: number) => {
      const value = t.type === "EXPENSE" ? -Number(t.amount || 0) : Number(t.amount || 0);

      running += value;

      console.log(
        `🟢 ${idx + 1}. TX=${t.type} ₹${t.amount} → running balance=${running}`
      );

      const when = t.createdAt ? new Date(t.createdAt) : new Date();
      return {
        name: when.toLocaleString(), 
        balance: Math.round(running),
      };
    });

    console.log("📊 Final chartData:", chart);

    return chart;
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <div className="h-40 flex items-center justify-center text-sm text-gray-500">No chart data.</div>;
  }

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ReTooltip
            formatter={(value, name) => {
              console.log("🟣 Tooltip value:", value, " key:", name);
              if (name === "balance") {
                return `₹${value.toLocaleString()}`;
              }
              return value;
            }}
            labelFormatter={(label) => {
              console.log("🟣 Tooltip label:", label);
              return "";
            }}
          />
          <Bar dataKey="balance" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
