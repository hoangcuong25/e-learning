"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Wallet, PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMyTransactionsApi } from "@/store/api/payment.api";
import { DepositConfirmationDialog } from "@/components/wallet/DepositConfirmation";

export default function WalletPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const updateTransactions = async () => {
    try {
      const res = await getMyTransactionsApi();
      setTransactions(res.data || []);
    } catch (error) {
      toast.error("Không thể tải lịch sử giao dịch");
    }
  };

  useEffect(() => {
    updateTransactions();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-6 mb-6">
        <Wallet className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ví của tôi</h1>
          <p className="text-gray-600 text-sm">
            Quản lý số dư và lịch sử giao dịch của bạn.
          </p>
        </div>
      </div>

      {/* Balance Section */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-gray-600">Số dư hiện tại</p>
          <h2 className="text-3xl font-bold text-blue-700 mt-1">
            {(user?.walletBalance || 0).toLocaleString()} LearnCoin
          </h2>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Nạp tiền
        </Button>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" /> Lịch sử giao dịch
        </h2>

        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {transactions.map((t) => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{t.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(t.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    t.amount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount.toLocaleString()} LC
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Chưa có giao dịch nào.</p>
        )}
      </div>

      <DepositConfirmationDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onDepositSuccess={updateTransactions}
      />

      {/* Animation Style... */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
