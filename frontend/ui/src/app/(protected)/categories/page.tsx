"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  icon?: string | null;
  userId?: string | null;
};

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openNew = () => {
    setEditing(null);
    setName("");
    setIcon("");
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon || "");
    setShowForm(true);
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return setError("Name required");

    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name: name.trim(), icon: icon.trim() });
      } else {
        await api.post("/categories", { name: name.trim(), icon: icon.trim() });
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Save failed");
    }
  };

  const doDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Categories</h1>

        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            ← Back
          </button>

          <button
            onClick={openNew}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
          >
            + Add Category
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-white rounded-xl border shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{c.icon || "🏷️"}</div>

              <div>
                <div className="text-lg font-medium">{c.name}</div>
                <div className="text-xs text-gray-400">{c.id}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => openEdit(c)}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
              >
                Edit
              </button>

              <button
                onClick={() => doDelete(c.id)}
                className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-10">
          No categories found.
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <form className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg" onSubmit={submit}>
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Category" : "New Category"}
            </h2>

            <label className="text-sm mb-1 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
            />

            <label className="text-sm mb-1 block">Icon (emoji)</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-2 border rounded-lg mb-5"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
