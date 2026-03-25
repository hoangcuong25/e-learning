"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, CheckCircle, HelpCircle, ListTodo, Pencil } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "sonner";
import {
  saveQuestion,
  updateQuestion,
} from "@/store/slice/course/question.slice";
import {
  createOption,
  deleteOption,
  updateOption,
} from "@/store/slice/course/option.slice";
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
            courseId: currentQuiz?.lesson?.chapter?.courseId,
            lessonId: currentQuiz?.lessonId,
            questionText: data.questionText,
            newOptions: formattedOptions, // gửi đúng định dạng
          },
        })
      ).unwrap();

      toast.success("Cập nhật câu hỏi và lựa chọn thành công!");
      setOpen(false);
      onUpdated();
    } catch (error: any) {
      console.error("Save question failed:", error);
      const msg = Array.isArray(error?.message) 
        ? error.message.join(", ") 
        : error?.message || "Cập nhật thất bại!";
      toast.error(msg);
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
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Pencil className="text-blue-600 w-5 h-5" />
                Chỉnh sửa câu hỏi & các lựa chọn
            </DialogTitle>
            <DialogDescription className="text-slate-500">
               Cập nhật nội dung câu hỏi và quản lý các phương án trả lời bên dưới.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 🧩 Câu hỏi */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <label className="font-bold text-slate-800">Nội dung câu hỏi</label>
              </div>
              <Textarea
                {...register("questionText", { required: true })}
                rows={3}
                placeholder="Nhập nội dung câu hỏi..."
                className="bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-lg p-4"
              />
            </div>

            {/* 🧩 Quản lý lựa chọn */}
            <div className="pt-6 space-y-4 border-t">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-800">Danh sách các lựa chọn</h3>
              </div>
              
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Thêm lựa chọn mới..."
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  className="bg-emerald-50/50 border-emerald-100 rounded-xl h-12 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-12 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </div>

              {/* Danh sách các option */}
              <div className="space-y-3">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between border rounded-2xl p-3 transition-all ${
                        opt.isCorrect 
                          ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                          : "bg-white border-slate-100 hover:border-slate-200 shadow-none"
                    }`}
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
                      className="border-none bg-transparent shadow-none focus-visible:ring-0 font-medium text-slate-700"
                    />
                    <div className="flex gap-1 items-center bg-white rounded-xl border border-slate-100 shadow-sm p-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleMarkCorrect(opt.id)}
                        className={`rounded-lg transition-all ${
                            opt.isCorrect 
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100" 
                              : "text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(opt.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-6 border-t mt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-xl px-6"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
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
