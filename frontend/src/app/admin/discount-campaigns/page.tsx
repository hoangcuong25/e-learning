"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllDiscounts } from "@/store/discount.slice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, PlusCircle } from "lucide-react";
import CreateDiscountForm from "@/components/discount/CreateDiscount";

export default function AdminDiscountCampaignsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { discounts, loading } = useSelector(
    (state: RootState) => state.discount
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllDiscounts(undefined));
  }, [dispatch]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">
          Quản lý chiến dịch giảm giá
        </h1>

        <div className="flex items-center gap-3">
          {/* Thanh tìm kiếm */}
          <div className="relative w-72">
            <Input
              placeholder="Tìm kiếm chiến dịch..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-indigo-200"
            />
            <Search className="absolute left-3 top-2.5 text-indigo-400 w-4 h-4" />
          </div>

          {/* Nút mở form tạo */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Tạo Chiến Dịch Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-full">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-indigo-700">
                  Tạo Chiến Dịch Mới
                </DialogTitle>
              </DialogHeader>
              <CreateDiscountForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
