"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, PlusCircle, Pencil, Percent } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import {
  deleteCoupon,
  fetchInstructorCoupons,
} from "@/store/slice/couponSlice";
import CouponForm from "@/components/instructor/coupon/CreateCoupon";
import UpdateCouponForm from "@/components/instructor/coupon/UpdateCoupon";
import CouponOnboarding from "@/components/instructor/onboarding/CouponOnboarding";

const Coupons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorCoupons, loading } = useSelector(
    (state: RootState) => state.coupon
  );

  // UI states
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editCoupon, setEditCoupon] = useState<{
    id: number;
    title: string;
    discountPercent: number;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  // Fetch all coupons
  useEffect(() => {
    dispatch(fetchInstructorCoupons());
  }, [dispatch]);

  // 🗑️ Delete coupon
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteCoupon(deleteId)).unwrap();
      await dispatch(fetchInstructorCoupons()).unwrap();
      toast.success("Đã xóa coupon thành công!");
      setDeleteId(null);
    } catch {
      toast.error("Xóa coupon thất bại!");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="step-coupon-header">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Quản lý Coupon của bạn
          </h1>
          <p className="text-gray-500">
            Tạo, chỉnh sửa và quản lý mã giảm giá cho khóa học của bạn.
          </p>
        </div>

        {/* Nút mở form tạo coupon */}
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 transition-all shadow-md step-create-coupon">
                <PlusCircle className="w-5 h-5" /> Tạo Coupon Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-full">
              <DialogTitle className="text-lg font-semibold mb-2">
                🎟️ Tạo Coupon Mới
              </DialogTitle>
              <CouponForm />
            </DialogContent>
          </Dialog>
          <CouponOnboarding />
        </div>
      </div>

      {/* Danh sách coupon */}
      <Card className="shadow-sm border border-gray-200 step-coupon-list">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-lg font-semibold">
            Danh sách Coupon ({instructorCoupons.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {instructorCoupons.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">
              Chưa có coupon nào được tạo.
            </p>
          ) : (
            <div className="grid gap-4">
              {instructorCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:shadow-md bg-white transition-all group"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-green-600 transition">
                      🎫 {coupon.code}
                    </h3>

                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Giảm:</strong>{" "}
                        <span className="font-bold text-green-600">
                          {coupon.percentage}%
                        </span>
                      </p>

                      {coupon.maxUsage !== null && (
                        <p>
                          <strong>Giới hạn:</strong> {coupon.maxUsage} lần sử
                          dụng
                        </p>
                      )}

                      <p>
                        <strong>Đã dùng:</strong> {coupon.usedCount} lần
                      </p>

                      {coupon.expiresAt ? (
                        <p>
                          <strong>Hết hạn:</strong>{" "}
                          <span
                            className={`${
                              new Date(coupon.expiresAt) < new Date()
                                ? "text-red-500"
                                : "text-gray-700"
                            }`}
                          >
                            {new Date(coupon.expiresAt).toLocaleString(
                              "vi-VN",
                              {
                                dateStyle: "short",
                                timeStyle: "short",
                              }
                            )}
                          </span>
                        </p>
                      ) : (
                        <p>
                          <strong>Không giới hạn thời gian</strong>
                        </p>
                      )}

                      <p>
                        <strong>Trạng thái:</strong>{" "}
                        {coupon.isActive ? (
                          <span className="text-green-600 font-medium">
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="text-gray-500 font-medium">
                            Ngưng hoạt động
                          </span>
                        )}
                      </p>

                      <p>
                        <strong>Áp dụng cho:</strong>{" "}
                        {coupon.target === "COURSE" && coupon.course ? (
                          <>
                            Khóa học:{" "}
                            <span className="text-blue-600 font-medium">
                              {coupon.course.title}
                            </span>
                          </>
                        ) : coupon.target === "SPECIALIZATION" &&
                          coupon.specialization ? (
                          <>
                            Chuyên ngành:{" "}
                            <span className="text-purple-600 font-medium">
                              {coupon.specialization.name}
                            </span>
                          </>
                        ) : (
                          <span className="italic text-gray-500">
                            Tất cả sản phẩm
                          </span>
                        )}
                      </p>

                      <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {new Date(coupon.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex items-center gap-2">
                    {/* Sửa */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                        >
                          <Pencil className="w-4 h-4" />
                          Sửa
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-3xl">
                        <UpdateCouponForm
                          coupon={coupon}
                          onSuccess={() => {
                            dispatch(fetchInstructorCoupons());
                            toast.success("Đã cập nhật coupon!");
                          }}
                          onCancel={() => toast.info("Đã hủy chỉnh sửa")}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Xóa */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setDeleteId(coupon.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Xác nhận xóa coupon
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn coupon{" "}
                            <strong>{coupon.title}</strong>. Bạn có chắc chắn
                            muốn tiếp tục không?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Coupons;
