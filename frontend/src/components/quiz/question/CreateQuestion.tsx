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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
      toast.success("Nội dung câu hỏi đã được xác nhận!");
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

      toast.success("Cấu trúc câu hỏi đã được hoàn thiện!");
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
        <Button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
          <PlusCircle className="w-5 h-5" /> Thêm Câu Hỏi
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] flex flex-col rounded-[3rem] border-none p-0 overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-10 pb-0 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6">
            <HelpCircle className="w-10 h-10" />
          </div>
          <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Thiết kế Câu hỏi
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
             Xây dựng nội dung & đáp án trắc nghiệm
          </DialogDescription>
        </DialogHeader>

        <div className="p-10 space-y-12 flex-1 overflow-y-auto custom-scrollbar">
          {/* STEP 1: QUESTION CONTENT */}
          <section className={`space-y-6 transition-all duration-500 ${createdQuestionId ? "opacity-40 grayscale-[0.6] pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-100">1</div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nội dung câu hỏi</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Đặt câu hỏi rõ ràng & súc tích</p>
                </div>
              </div>
              {createdQuestionId && <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg px-2 py-1 text-[10px] font-black uppercase">Confirmed</Badge>}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Textarea
                {...register("questionText", { required: true })}
                placeholder="Ví dụ: Thuộc tính nào dùng để căn giữa phần tử trong Flexbox?"
                className="min-h-[120px] bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-[2rem] transition-all font-bold p-8 text-lg text-slate-900 leading-relaxed outline-none"
                disabled={!!createdQuestionId}
              />

              {!createdQuestionId && (
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="h-14 rounded-2xl font-bold px-8 text-slate-400 hover:text-slate-600"
                  >
                    Bỏ qua
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 bg-slate-900 text-white font-black uppercase tracking-widest px-10 rounded-2xl shadow-xl transition-all active:scale-95"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận & Sang bước 2"}
                  </Button>
                </div>
              )}
            </form>
          </section>

          {/* STEP 2: OPTIONS MANAGEMENT */}
          {createdQuestionId && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="h-px bg-slate-100" />
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-100 animate-bounce">2</div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Đáp án & Lựa chọn</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Thêm ít nhất 2 phương án trả lời</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Input
                  placeholder="Nhập nội dung 1 phương án trả lời..."
                  value={optionText}
                  onChange={(e) => setOptionText(e.target.value)}
                  className="h-16 bg-indigo-50/30 border-transparent focus:bg-white focus:border-indigo-200 rounded-2xl transition-all font-bold px-8 text-slate-900 outline-none"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOption())}
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  className="h-16 bg-indigo-600 text-white font-black uppercase tracking-widest px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                  Thêm
                </Button>
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 gap-4">
                {options.map((opt, index) => (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all duration-300 ${
                       opt.isCorrect 
                        ? "bg-emerald-50 border-emerald-500/20 shadow-lg shadow-emerald-50" 
                        : "bg-white border-slate-50 hover:border-slate-100"
                    } group/item`}
                  >
                    <div className="flex items-center gap-4 flex-1 mr-4">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${
                         opt.isCorrect ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                       }`}>
                         {String.fromCharCode(65 + index)}
                       </div>
                       <Input
                         value={opt.text}
                         onChange={(e) =>
                           setOptions((prev) =>
                             prev.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o))
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
                        onClick={() => handleDeleteOption(opt.id)}
                        className="w-12 h-12 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic animate-pulse">
                   * Chọn 1 đáp án đúng bằng nút tích xanh
                </p>
                <Button
                  type="button"
                  onClick={handleSaveOptions}
                  className="h-16 h-px-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black uppercase tracking-widest px-12 rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  disabled={isSavingOptions}
                >
                  {isSavingOptions ? "Đang hoàn tất..." : "Lưu tất cả & Hoàn tất"}
                </Button>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestion;
