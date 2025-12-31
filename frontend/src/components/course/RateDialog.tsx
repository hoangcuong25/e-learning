"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RateFormValues, RateSchema } from "@/hook/zod-schema/RatingSchema";

interface RateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (rating: number, text: string) => void;
}

export function RateDialog({ open, setOpen, onSubmit }: RateDialogProps) {
  const form = useForm<RateFormValues>({
    resolver: zodResolver(RateSchema),
    defaultValues: {
      rating: 5,
      text: "",
    },
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const handleFormSubmit = (data: RateFormValues) => {
    onSubmit(data.rating, data.text);

    // Đóng dialog và reset form
    setOpen(false);
    reset();
  };

  // Hàm xử lý đóng dialog để reset form khi người dùng nhấn Hủy
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    setOpen(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Đánh giá khóa học</AlertDialogTitle>
            <AlertDialogDescription>
              Nhập điểm đánh giá (1-5) và nội dung chi tiết.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <label
              htmlFor="rating"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Điểm đánh giá (1-5)
            </label>
            <input
              id="rating"
              type="number"
              min={1}
              max={5}
              {...register("rating", { valueAsNumber: true })}
              className="w-full border rounded-md p-2"
              placeholder="Nhập điểm (1-5)"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="text"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Nội dung đánh giá
            </label>
            <textarea
              id="text"
              rows={4}
              {...register("text")}
              className="w-full border rounded-md p-2 resize-none"
              placeholder="Chia sẻ kinh nghiệm của bạn về khóa học..."
            />
            {/* Hiển thị lỗi */}
            {errors.text && (
              <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
            )}
          </div>
          <AlertDialogFooter className="mt-6 flex justify-end">
            <AlertDialogCancel type="button">Hủy</AlertDialogCancel>

            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ml-2"
            >
              Gửi đánh giá
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
