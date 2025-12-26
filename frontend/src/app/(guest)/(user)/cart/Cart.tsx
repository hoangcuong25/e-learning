"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function MyCartPage() {
  const [cart, setCart] = useState([
    {
      id: 1,
      title: "Khóa học Next.js 15 toàn tập",
      instructor: "Nguyễn Văn A",
      price: 499000,
      thumbnail: "/images/course-1.jpg",
    },
    {
      id: 2,
      title: "Lập trình Backend với NestJS",
      instructor: "Trần Văn B",
      price: 599000,
      thumbnail: "/images/course-2.jpg",
    },
  ]);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleRemove = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (coupon === "GIAM10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert("❌ Mã giảm giá không hợp lệ");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        🛒 Giỏ hàng của tôi
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">
          Giỏ hàng của bạn đang trống.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách khóa học */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition border-blue-100"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-blue-100">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-blue-800">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600">{item.instructor}</p>
                    <p className="text-blue-600 font-bold mt-1">
                      {item.price.toLocaleString()}₫
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    className="hover:bg-blue-50"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Thanh toán */}
          <div>
            <Card className="border-blue-200 shadow-md">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-blue-700">
                  💳 Tóm tắt đơn hàng
                </h3>

                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()}₫</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Giảm giá</span>
                  <span className="text-red-500">
                    -{discount.toLocaleString()}₫
                  </span>
                </div>

                <hr className="border-blue-100" />

                <div className="flex justify-between text-lg font-semibold text-blue-800">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá (VD: GIAM10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-400"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleApplyCoupon}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    Áp dụng
                  </Button>
                </div>

                <Button className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white transition">
                  Thanh toán
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
