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
import { PlusCircle, CheckCircle, Trash2, HelpCircle, ListTodo } from "lucide-react";
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
    } catch (error: any) {
      const msg = Array.isArray(error?.message) 
        ? error.message.join(", ") 
        : error?.message || "Có lỗi xảy ra khi tạo câu hỏi.";
      toast.error(msg);
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
    } catch (error: any) {
      const msg = Array.isArray(error?.message) 
        ? error.message.join(", ") 
        : error?.message || "Có lỗi xảy ra khi lưu lựa chọn.";
      toast.error(msg);
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
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="text-blue-600" />
            Tạo câu hỏi & đáp án
          </DialogTitle>
          <DialogDescription className="text-slate-500">
             Thêm câu hỏi trắc nghiệm mới vào bài kiểm tra của bạn.
          </DialogDescription>
        </DialogHeader>

        {/* PHẦN 1: TẠO CÂU HỎI */}
        <section className={`transition-all duration-300 ${createdQuestionId ? "opacity-50 pointer-events-none grayscale-[0.5]" : ""}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</span>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                Nội dung câu hỏi
            </h3>
          </div>
          
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Textarea
                {...register("questionText", { required: true })}
                placeholder="Ví dụ: Để định vị phần tử trong CSS, ta sử dụng thuộc tính nào?"
                rows={3}
                disabled={!!createdQuestionId}
                className="bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-lg p-4"
              />
            </div>

            {!createdQuestionId && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  {isSubmitting ? "Đang lưu..." : "Xác nhận & Sang bước 2"}
                </Button>
              </div>
            )}
          </form>
        </section>

        {/* PHẦN 2: TẠO CÁC LỰA CHỌN (OPTION) */}
        {createdQuestionId && (
          <section className="pt-6 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-emerald-500" />
                  Đáp án & Lựa chọn
              </h3>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Nhập nội dung đáp án..."
                value={optionText}
                onChange={(e) => setOptionText(e.target.value)}
                className="bg-emerald-50/50 border-emerald-100 rounded-xl h-12 focus:ring-2 focus:ring-emerald-500 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
              />
              <Button
                type="button"
                onClick={handleAddOption}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-12 transition-all active:scale-95"
              >
                Thêm
              </Button>
            </div>

            {/* Danh sách option */}
            <div className="space-y-3 mt-6">
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
                      onClick={() => handleDeleteOption(opt.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="button"
                onClick={handleSaveOptions}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-6 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                disabled={isSavingOptions}
              >
                {isSavingOptions ? "Đang lưu..." : "Lưu tất cả & Hoàn tất"}
              </Button>
            </div>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestion;
