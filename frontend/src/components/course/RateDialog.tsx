"use client";

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
import { useState } from "react";

export function RateDialog({ open, setOpen, onSubmit }: any) {
  const [rating, setRating] = useState("");

  const handleSubmit = () => {
    onSubmit(Number(rating));
    setOpen(false);
    setRating("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đánh giá khóa học</AlertDialogTitle>
          <AlertDialogDescription>
            Nhập điểm đánh giá từ 1 đến 5.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border rounded-md p-2 mt-3"
          placeholder="Nhập điểm (1-5)"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            disabled={!rating}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gửi đánh giá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
