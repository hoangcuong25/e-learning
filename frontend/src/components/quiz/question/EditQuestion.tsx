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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "sonner";
import { saveQuestion, updateQuestion } from "@/store/question.slice";
import { createOption, deleteOption, updateOption } from "@/store/option.slice";
import DeleteOption from "./DeleteQuestion";

interface EditQuestionProps {
  question: any;
  onUpdated: () => void;
  currentQuiz: QuizType;
}

const EditQuestion: React.FC<EditQuestionProps> = ({
  question,
  onUpdated,
  currentQuiz,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      questionText: question.questionText,
    },
  });

  // Copy mảng options gốc để chỉnh sửa tạm thời
  const [options, setOptions] = useState<any[]>(question.options || []);
  const [newOptionText, setNewOptionText] = useState("");

  // 🧩 Cập nhật câu hỏi & các lựa chọn
  const onSubmit = async (data: any) => {
    try {
      const formattedOptions = options.map((opt) => ({
        optionText: opt.text, // đổi tên field cho khớp backend
        isCorrect: opt.isCorrect,
      }));

      await dispatch(
        saveQuestion({
          id: question.id,
          payload: {
            quizId: currentQuiz.id,
            courseId: currentQuiz?.lesson?.courseId,
            lessonId: currentQuiz?.lessonId,
            questionText: data.questionText,
            newOptions: formattedOptions, // gửi đúng định dạng
          },
        })
      ).unwrap();

      toast.success("Cập nhật câu hỏi và lựa chọn thành công!");
      setOpen(false);
      onUpdated();
    } catch (error) {
      console.error("Save question failed:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  // 🧩 Thêm option tạm thời
  const handleAddOption = () => {
    if (!newOptionText.trim()) {
      toast.error("Nội dung lựa chọn không được để trống.");
      return;
    }

    const newOption = {
      id: Date.now(), // tạm ID
      text: newOptionText,
      isCorrect: false,
    };

    setOptions((prev) => [...prev, newOption]);
    setNewOptionText("");
  };

  // 🧩 Đánh dấu đúng (chỉ cho 1 option đúng)
  const handleMarkCorrect = (id: number) => {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id,
      }))
    );
  };

  // 🧩 Xóa option (confirm riêng)
  const handleDeleteOption = async (id: number) => {
    try {
      // Nếu là option cũ (đã có trong DB)
      if (!String(id).startsWith("temp")) {
        await dispatch(deleteOption(id)).unwrap();
      }
      setOptions((prev) => prev.filter((opt) => opt.id !== id));
      toast.success("Xóa lựa chọn thành công!");
    } catch {
      toast.error("Xóa lựa chọn thất bại!");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Sửa
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>✏️ Chỉnh sửa câu hỏi & lựa chọn</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 🧩 Câu hỏi */}
            <div>
              <label className="text-sm font-medium">Nội dung câu hỏi</label>
              <Textarea
                {...register("questionText", { required: true })}
                rows={3}
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            {/* 🧩 Quản lý lựa chọn */}
            <div className="pt-2 space-y-3 border-t">
              <h3 className="font-semibold text-gray-800">
                Danh sách lựa chọn
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Thêm lựa chọn mới..."
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>

              {/* Danh sách các option */}
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
                        onClick={() => setDeleteConfirmId(opt.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
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
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Confirm Delete */}
      <DeleteOption
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDeleteOption(deleteConfirmId!)}
      />
    </>
  );
};

export default EditQuestion;
