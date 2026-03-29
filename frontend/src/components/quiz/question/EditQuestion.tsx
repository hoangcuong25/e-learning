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
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  HelpCircle,
  ListTodo,
  Pencil,
} from "lucide-react";
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
        }),
      ).unwrap();

      toast.success("Cấu trúc câu hỏi đã được cập nhật!");
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
      })),
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
      toast.success("Đã loại bỏ lựa chọn!");
    } catch {
      toast.error("Loại bỏ thất bại!");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all active:scale-95"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl h-[90vh] overflow-hidden rounded-[3rem] border-none p-0 bg-white shadow-2xl">
          <DialogHeader className="p-10 pb-0 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6">
              <Pencil className="w-10 h-10" />
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
              Hiệu chỉnh Câu hỏi
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
              Cập nhật nội dung & cấu trúc đáp án
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-10 space-y-12 overflow-y-auto h-full"
          >
            {/* 🧩 Câu hỏi */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-100">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Nội dung câu hỏi
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Nội dung chính của bài kiểm tra
                  </p>
                </div>
              </div>
              <Textarea
                {...register("questionText", { required: true })}
                placeholder="Nhập nội dung câu hỏi..."
                className="min-h-[120px] bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-[2rem] transition-all font-bold p-8 text-lg text-slate-900 leading-relaxed outline-none"
              />
            </section>

            {/* 🧩 Quản lý lựa chọn */}
            <section className="space-y-8">
              <div className="h-px bg-slate-100" />

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-100">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Đáp án & Lựa chọn
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Quản lý các phương án trả lời
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Input
                  placeholder="Thêm một lựa chọn mới..."
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  className="h-16 bg-indigo-50/30 border-transparent focus:bg-white focus:border-indigo-200 rounded-2xl transition-all font-bold px-8 text-slate-900 outline-none"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddOption())
                  }
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  className="h-16 bg-indigo-600 text-white font-black uppercase tracking-widest px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                  Thêm
                </Button>
              </div>

              {/* Danh sách các option */}
              <div className="grid grid-cols-1 gap-4">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all duration-300 ${
                      opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500/20 shadow-lg shadow-emerald-50"
                        : "bg-white border-slate-50 hover:border-slate-100"
                    } group/item`}
                  >
                    <div className="flex items-center gap-4 flex-1 mr-4">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${
                          opt.isCorrect
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Input
                        value={opt.text}
                        onChange={(e) =>
                          setOptions((prev) =>
                            prev.map((o, idx) =>
                              idx === index
                                ? { ...o, text: e.target.value }
                                : o,
                            ),
                          )
                        }
                        className="border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-slate-900"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleMarkCorrect(opt.id)}
                        className={`w-12 h-12 rounded-xl transition-all active:scale-90 ${
                          opt.isCorrect
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                            : "text-slate-300 hover:bg-emerald-50 hover:text-emerald-500"
                        }`}
                      >
                        <CheckCircle size={20} />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(opt.id)}
                        className="w-12 h-12 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <DialogFooter className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Hủy bỏ mọi thay đổi
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-16 h-px-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black uppercase tracking-widest px-12 rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "Cập nhật Câu hỏi"}
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
