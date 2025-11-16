"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export default function BudgetCard() {
  const [budget, setBudget] = useState(0);
  const [spend, setSpend] = useState(0);
  const [loading, setLoading] = useState(true);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets?month=${month}&year=${year}`);
      setBudget(res.data.amount || 0);

      const txRes = await api.get(`/transactions?startDate=${year}-${month}-01&endDate=${year}-${month}-31`);
      const totalSpend = txRes.data.data
  .filter((t: any) => t.type === "EXPENSE")
  .reduce((sum: number, t: any) => sum + t.amount, 0);
      setSpend(totalSpend);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async () => {
    try {
      await api.post("/budgets", { month, year, amount: budget });
      alert("Budget saved!");
      fetchBudget();
    } catch (err) {
      console.error(err);
      alert("Failed to save budget");
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const progress = budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;

  if (loading) return <div>Loading budget...</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Monthly Budget</h3>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
        <button
          onClick={saveBudget}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-1">
        This Month Spend: ₹{spend}
      </div>
      <div className="w-full h-4 bg-gray-200 rounded">
        <div
          className="h-4 bg-green-500 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {progress.toFixed(0)}% of budget used
      </div>
    </div>
  );
}
