"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "@/store/slice/course/question.slice";
import { createManyOptions } from "@/store/slice/course/option.slice";
import { toast } from "sonner";
import { fetchQuizById } from "@/store/slice/course/quizSlice";

interface CreateQuestionProps {
  quizId: number;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({ quizId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  // Form tạo câu hỏi
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { questionText: "" },
  });

  // State lưu id câu hỏi sau khi tạo
  const [createdQuestionId, setCreatedQuestionId] = useState<number | null>(
    null
  );

  // State quản lý danh sách option tạm thời
  const [options, setOptions] = useState<
    { id: number; text: string; isCorrect: boolean }[]
  >([]);
  const [optionText, setOptionText] = useState("");
  const [isSavingOptions, setIsSavingOptions] = useState(false);

  // 🧩 Gửi API tạo câu hỏi
  const onSubmit = async (values: any) => {
    try {
      const payload = { ...values, quizId };
      const result = await dispatch(createQuestion(payload)).unwrap();

      setCreatedQuestionId(result.id); // lưu id câu hỏi vừa tạo
      toast.success("Câu hỏi đã được tạo thành công.");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo câu hỏi.");
    }
  };

  // 🧩 Thêm option tạm
  const handleAddOption = () => {
    if (!optionText.trim()) {
      toast.error("Nội dung đáp án không được để trống.");
      return;
    }
    setOptions([
      ...options,
      {
        id: Date.now(),
        text: optionText,
        isCorrect: false,
      },
    ]);
    setOptionText("");
  };

  // 🧩 Đánh dấu option đúng
  const handleMarkCorrect = (id: number) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id
          ? { ...opt, isCorrect: true }
          : { ...opt, isCorrect: false }
      )
    );
  };

  // 🧩 Xóa option
  const handleDeleteOption = (id: number) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  // 🧩 Lưu option vào DB (gọi API /options/bulk)
  const handleSaveOptions = async () => {
    if (!createdQuestionId) {
      toast.error("Bạn cần tạo câu hỏi trước khi thêm đáp án.");
      return;
    }

    if (options.length === 0) {
      toast.error("Hãy thêm ít nhất 1 lựa chọn.");
      return;
    }

    try {
      setIsSavingOptions(true);

      const payload = {
        options: options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          questionId: createdQuestionId,
        })),
      };

      await dispatch(createManyOptions(payload)).unwrap();
      await dispatch(fetchQuizById(quizId)).unwrap();

      toast.success("Các lựa chọn đã được lưu thành công!");

      // Reset toàn bộ form
      setOptions([]);
      setOptionText("");
      setOpen(false);
      reset();
      setCreatedQuestionId(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu lựa chọn.");
    } finally {
      setIsSavingOptions(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-4 h-4" /> Tạo câu hỏi
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>🧩 Tạo câu hỏi và đáp án</DialogTitle>
        </DialogHeader>

        {/* PHẦN 1: TẠO CÂU HỎI */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border-b pb-4"
        >
          <div className="text-sm text-gray-600">
            <strong>Quiz ID:</strong> {quizId}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Nội dung câu hỏi</label>
            <Textarea
              {...register("questionText", { required: true })}
              placeholder="Nhập nội dung câu hỏi..."
              rows={3}
              disabled={!!createdQuestionId}
            />
          </div>

          {!createdQuestionId && (
            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu câu hỏi"}
              </Button>
            </DialogFooter>
          )}
        </form>

        {/* PHẦN 2: TẠO CÁC LỰA CHỌN (OPTION) */}
        {createdQuestionId && (
          <div className="pt-4 space-y-4">
            <h3 className="font-semibold text-gray-800">
              ✏️ Thêm lựa chọn cho câu hỏi
            </h3>

            <div className="flex gap-2">
              <Input
                placeholder="Nhập nội dung đáp án..."
                value={optionText}
                onChange={(e) => setOptionText(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAddOption}
                className="bg-green-600 hover:bg-green-700"
              >
                Thêm
              </Button>
            </div>

            {/* Danh sách option */}
            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center justify-between border rounded-md p-2 bg-gray-50"
                >
                  <Input
                    value={opt.text}
                    onChange={(e) =>
                      setOptions((prev) =>
                        prev.map((o) =>
                          o.id === opt.id ? { ...o, text: e.target.value } : o
                        )
                      )
                    }
                  />
                  <div className="flex gap-2 items-center">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleMarkCorrect(opt.id)}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          opt.isCorrect ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleDeleteOption(opt.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="flex justify-end">
              <Button
                type="button"
                onClick={handleSaveOptions}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSavingOptions}
              >
                {isSavingOptions ? "Đang lưu..." : "Lưu tất cả lựa chọn"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestion;
