"use client";
import React from "react";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";

type Transaction = {
  id: string;
  description?: string;
  amount: number;
  type: "EXPENSE" | "INCOME" | string;
  category: { name: string; icon?: string };
  createdAt: string;
};

export default function TransactionCard({ tx }: { tx: Transaction }) {
  const amountColor =
    tx.type === "EXPENSE" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400";

  return (
    <Tooltip.Root delayDuration={120}>
      <Tooltip.Trigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          layout
          className="
            flex items-center justify-between gap-3 py-4 
            border-b border-gray-200 dark:border-gray-700
            hover:bg-gray-50 dark:hover:bg-gray-800/40
            transition-all rounded-md px-2
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-2xl">
              {tx.category.icon || "🏷️"}
            </div>

            <div className="min-w-0">
              <div className="font-medium truncate text-gray-900 dark:text-gray-100">
                {tx.description || tx.category.name}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {tx.category.name}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-right min-w-fit">
            <div className={`font-semibold ${amountColor}`}>
              {tx.type === "EXPENSE" ? `- ₹${tx.amount}` : `₹${tx.amount}`}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(tx.createdAt).toLocaleString()}
            </div>
          </div>
        </motion.div>
      </Tooltip.Trigger>

      {/* TOOLTIP */}
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          align="center"
          className="rounded-md px-3 py-2 bg-gray-900 text-white text-sm shadow-lg z-50"
        >
          <div className="leading-tight space-y-1">
            <div className="font-semibold text-white">
              {tx.description || tx.category.name}
            </div>
            <div>Category: {tx.category.name}</div>
            <div>Amount: ₹{tx.amount}</div>
            <div>Type: {tx.type}</div>
          </div>

          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
