"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; icon?: string | null };
type Transaction = {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  type: string;
  description?: string;
  createdAt: string;
  category?: Category;
};

export default function TransactionsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBalance, setTotalBalance] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");


 const fetchData = async (page = 1) => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("perPage", "10");

    if (categoryId) params.append("categoryId", categoryId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (minAmount) params.append("minAmount", minAmount);
    if (maxAmount) params.append("maxAmount", maxAmount);

    const [cRes, tRes] = await Promise.all([
      api.get("/categories"),
      api.get(`/transactions?${params.toString()}`),
    ]);

    setCategories(cRes.data);
    setTransactions(tRes.data.data);
    setPage(tRes.data.meta.page);
    setTotalPages(tRes.data.meta.totalPages);
  } catch (err) {
    console.error(err);
    alert("Failed to load data");
  } finally {
    setLoading(false);
  }
};


const fetchSummary = async () => {
  try {
    const res = await api.get('/transactions/summary');
    setTotalBalance(res.data.totalBalance);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchData(1); // get page
  fetchSummary(); // for total balance
}, []);


  const openNew = () => {
    setEditing(null);
    setCategoryId(categories[0]?.id || "");
    setAmount("");
    setType("EXPENSE");
    setDescription("");
    setShowForm(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setCategoryId(tx.categoryId);
    setAmount(tx.amount);
    setType(tx.type as any);
    setDescription(tx.description || "");
    setShowForm(true);
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!categoryId || amount === "") return alert("Category & amount required");

    try {
      if (editing) {
        await api.put(`/transactions/${editing.id}`, {
          categoryId,
          amount,
          type,
          description,
        });
      } else {
        await api.post("/transactions", {
          categoryId,
          amount,
          type,
          description,
        });
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Save failed");
    }
  };

  const doDelete = async (id: string) => {
    if (!confirm("Delete transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 border"
          >
            Back
          </button>

          <button
            onClick={openNew}
            className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <div className="p-5 rounded-xl shadow bg-white border">
          <div className="text-lg text-gray-600">Total Balance:</div>
          <div className="text-3xl font-bold text-gray-900">
            ₹{totalBalance.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {transactions.length} transactions
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded shadow flex flex-wrap gap-4">
      {/* Category */}
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="p-2 border rounded bg-gray-50"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Date Range */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="p-2 border rounded bg-gray-50"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="p-2 border rounded bg-gray-50"
      />

      {/* Amount Range */}
      <input
        type="number"
        placeholder="Min Amount"
        value={minAmount}
        onChange={(e) => setMinAmount(e.target.value)}
        className="p-2 border rounded bg-gray-50"
      />
      <input
        type="number"
        placeholder="Max Amount"
        value={maxAmount}
        onChange={(e) => setMaxAmount(e.target.value)}
        className="p-2 border rounded bg-gray-50"
      />

      {/* Apply Filter Button */}
      <button
        onClick={() => fetchData(1)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply
      </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{tx.category?.icon || "🏷️"}</div>

              <div>
                <div className="font-semibold text-gray-900">
                  {tx.description || tx.category?.name}
                </div>
                <div className="text-xs text-gray-500">{tx.category?.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`font-semibold ${
                  tx.type === "EXPENSE" ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{tx.amount}
              </div>

              <button
                onClick={() => openEdit(tx)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                Edit
              </button>

              <button
                onClick={() => doDelete(tx.id)}
                className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => fetchData(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        <span className="px-3 py-1 border rounded">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => fetchData(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>  
        
      



      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={submit}
            className="bg-white p-6 rounded-xl w-[420px] shadow-xl border"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {editing ? "Edit Transaction" : "New Transaction"}
            </h3>

            <label className="text-sm text-gray-600">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 mb-3 border rounded bg-gray-50"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ""}
                  {c.name}
                </option>
              ))}
            </select>

            <label className="text-sm text-gray-600">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 mb-3 border rounded bg-gray-50"
            />

            <label className="text-sm text-gray-600">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 mb-3 border rounded bg-gray-50"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>

            <label className="text-sm text-gray-600">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-5 border rounded bg-gray-50"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
