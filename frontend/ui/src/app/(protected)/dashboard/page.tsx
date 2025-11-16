"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import SpendChart from "@/components/Chart";
import TransactionCard from "@/components/TransactionCard";
import BudgetCard from "@/components/BudgetCard";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const currentMonth = new Date().getMonth(); // 0-based
  const currentYear = new Date().getFullYear();

  const monthlySpend = transactions
  .filter(
    t =>
      t.type === "EXPENSE" &&
      new Date(t.createdAt).getMonth() === currentMonth &&
      new Date(t.createdAt).getFullYear() === currentYear
  )
  .reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, txRes] = await Promise.all([
          api.get("/transactions/summary"),
          api.get("/transactions?page=1&perPage=5")
        ]);

        setSummary(summaryRes.data);
        setTransactions(txRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <BudgetCard />
      


      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Spend */}
        <div className="p-6 rounded bg-white shadow">
          <div className="text-sm text-gray-600">Total Spend</div>
          <div className="text-3xl font-bold">₹{summary.totalBalance}</div>
        </div>
        {/* Monthly Spend */}
        <div className="p-6 rounded bg-white shadow">
          <div className="text-sm text-gray-600">Month Spend</div>
          <div className="text-3xl font-bold">₹{monthlySpend}</div>
        </div>

        {/* Transaction Count */}
        <div className="p-6 rounded bg-white shadow">
          <div className="text-sm text-gray-600">Transactions</div>
          <div className="text-3xl font-bold">{summary.transactionCount}</div>
        </div>
      </div>

      {/* CHART */}
      <div className="p-6 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Spending Overview</h2>
        <SpendChart data={transactions} />
      </div>

      {/* LAST 5 TRANSACTIONS */}
      <div className="p-6 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

        {transactions.slice(0, 5).map((tx) => (
          <TransactionCard key={tx.id} tx={tx} />
        ))}
      </div>

    </div>
  );
}
