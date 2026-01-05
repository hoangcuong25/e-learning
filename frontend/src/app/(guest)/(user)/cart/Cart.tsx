"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCart, removeFromCart } from "@/store/slice/cartSlice";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";

export default function MyCartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const router = useRouter();

  // Chỉ chọn 1 course
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Gọi API lấy giỏ hàng khi load trang
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (courseId: number) => {
    dispatch(removeFromCart(courseId));
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }
  };

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
  };

  const subtotal = items
    .filter((item) => item.courseId === selectedCourseId)
    .reduce((sum, item) => sum + (item.course?.price || 0), 0);

  const handleCheckout = () => {
    if (!selectedCourseId) {
      alert("Vui lòng chọn một khóa học để thanh toán!");
      return;
    }
    router.push(`/payment/${selectedCourseId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        🛒 Giỏ hàng của tôi
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-600 text-center">
          Giỏ hàng của bạn đang trống.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách khóa học */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.courseId}
                className="hover:shadow-lg transition border-blue-100 cursor-pointer"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <input
                    type="radio"
                    name="selectedCourse"
                    checked={selectedCourseId === item.courseId}
                    onChange={() => handleSelectCourse(item.courseId)}
                    className="w-5 h-5"
                  />

                  <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-blue-100">
                    <Image
                      src={item.course?.thumbnail || "/images/default.jpg"}
                      alt={item.course?.title || ""}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-blue-800">
                      {item.course?.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {(item.course?.instructor as any) || "Giảng viên ẩn danh"}
                    </p>
                    <p className="text-blue-600 font-bold mt-1">
                      {item.course?.price?.toLocaleString()} LC
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.courseId)}
                    className="hover:bg-blue-50"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar bên phải */}
          <Card className="p-4 rounded-xl border border-blue-100 bg-white shadow-sm mt-6">
            <ul className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Truy cập không giới hạn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Tài liệu và video chất lượng cao</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cập nhật khóa học miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" />
                <span>Bảo mật thanh toán an toàn</span>
              </div>
            </ul>

            <p className="mt-4 text-center text-sm text-blue-600 font-medium">
              Chọn một khóa học để thanh toán!
            </p>

            <div className="mt-4 text-center space-y-1">
              <p className="text-gray-700 text-sm">
                Tạm tính: {subtotal.toLocaleString()} LC
              </p>
              <p className="text-blue-700 font-semibold text-lg">
                Tổng cộng: {subtotal.toLocaleString()} LC
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Nhớ kiểm tra lại khóa học trước khi thanh toán 😉
            </p>

            <Button
              onClick={handleCheckout}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Thanh toán
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
