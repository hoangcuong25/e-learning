"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllDiscounts,
  toggleDiscountStatus,
  deleteDiscount,
} from "@/store/slice/discount.slice";

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
import { Search, PlusCircle, Trash2, Power } from "lucide-react";
import CreateDiscountForm from "@/components/admin/discount/CreateDiscount";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDiscountCampaignsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { discounts, loading, totalPages } = useSelector(
    (state: RootState) => state.discount
  );

  const router = useRouter();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Lấy danh sách
  useEffect(() => {
    dispatch(fetchAllDiscounts({ page }));
  }, [dispatch, page]);

  // Toggle trạng thái
  const handleToggleStatus = async (id: number) => {
    try {
      await dispatch(toggleDiscountStatus(id)).unwrap();
      toast.success("Cập nhật trạng thái thành công");
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Xóa chiến dịch
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa chiến dịch này không?")) return;
    try {
      await dispatch(deleteDiscount(id)).unwrap();
      await dispatch(fetchAllDiscounts({ page }));
      toast.success("Xóa chiến dịch thành công");
    } catch {
      toast.error("Không thể xóa chiến dịch");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">
          Quản lý chiến dịch giảm giá
        </h1>

        <div className="flex items-center gap-3">
          {/* Thanh tìm kiếm (tạm chưa dùng) */}
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

      {/* Bảng danh sách */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chiến dịch</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-6">Đang tải...</p>
          ) : !Array.isArray(discounts) || discounts.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              Không có chiến dịch nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr>
                    <th className="py-3 px-4 text-left">Tên chiến dịch</th>
                    <th className="py-3 px-4 text-center">Giảm giá (%)</th>
                    <th className="py-3 px-4 text-left">Thời gian</th>
                    <th className="py-3 px-4 text-left">Trạng thái</th>
                    <th className="py-3 px-4 text-left">Coupon</th>
                    <th className="py-3 px-4 text-right">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {discounts.map((discount: any) => (
                    <tr
                      key={discount.id}
                      className="border-t hover:bg-indigo-50 transition"
                    >
                      <td className="py-3 px-4 font-medium text-indigo-700">
                        {discount.title}
                      </td>

                      <td className="py-3 px-4 text-center font-semibold text-blue-600">
                        {discount.percentage}%
                      </td>

                      <td className="py-3 px-4">
                        {discount.startsAt
                          ? new Date(discount.startsAt).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {discount.endsAt
                          ? new Date(discount.endsAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            discount.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {discount.isActive ? "Đang hoạt động" : "Ngừng"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {discount.coupons && discount.coupons.length > 0 ? (
                          <span className="font-semibold text-blue-600">
                            {discount.coupons.length} coupon
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">0</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        {/* Nút bật/tắt trạng thái */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(discount.id)}
                        >
                          <Power
                            className={`w-4 h-4 ${
                              discount.isActive
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          />
                        </Button>

                        {/* Nút xem chi tiết */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-700 text-white"
                          onClick={() => {
                            router.push(
                              `/admin/discount-campaigns/${discount.id}`
                            );
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <Pagination total={totalPages} page={page} onChange={setPage} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
