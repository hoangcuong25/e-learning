"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, CheckCircle, HelpCircle, ListTodo, Pencil, Loader2, Sparkles, Save } from "lucide-react";
import { 
  updateGeneratedQuestion, 
  removeGeneratedQuestion, 
  clearQuizState 
} from "@/store/slice/course/quizSlice";
import { createQuestion } from "@/store/slice/course/question.slice";
import { toast } from "sonner";

interface Props {
  quizId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiQuizPreviewDialog = ({ quizId, open, onOpenChange }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { generatedQuestions, loading } = useSelector((state: RootState) => state.quiz);
  const [saving, setSaving] = useState(false);

  // Local state for editing (cloned from redux to avoid direct mutation while typing)
  const [localQuestions, setLocalQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setLocalQuestions(Array.isArray(generatedQuestions) ? JSON.parse(JSON.stringify(generatedQuestions)) : []);
    }
  }, [open, generatedQuestions]);

  const handleUpdateQuestionText = (index: number, text: string) => {
    if (!Array.isArray(localQuestions)) return;
    const newQuestions = [...localQuestions];
    if (newQuestions[index]) {
      newQuestions[index].content = text;
      setLocalQuestions(newQuestions);
    }
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, fields: any) => {
    if (!Array.isArray(localQuestions)) return;
    const newQuestions = [...localQuestions];
    if (newQuestions[qIndex] && Array.isArray(newQuestions[qIndex].options) && newQuestions[qIndex].options[oIndex]) {
      newQuestions[qIndex].options[oIndex] = {
        ...newQuestions[qIndex].options[oIndex],
        ...fields
      };
      
      // If setting isCorrect to true, set others to false
      if (fields.isCorrect === true) {
        newQuestions[qIndex].options.forEach((opt: any, i: number) => {
          if (i !== oIndex) opt.isCorrect = false;
        });
      }
      
      setLocalQuestions(newQuestions);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    if (!Array.isArray(localQuestions)) return;
    const newQuestions = localQuestions.filter((_, i) => i !== index);
    setLocalQuestions(newQuestions);
    dispatch(removeGeneratedQuestion(index));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      if (!Array.isArray(localQuestions)) return;
      let successCount = 0;
      for (const q of localQuestions) {
        await dispatch(createQuestion({
          questionText: q.content,
          quizId,
          options: q.options || []
        })).unwrap();
        successCount++;
      }
      toast.success(`Đã lưu thành công ${successCount} câu hỏi!`);
      dispatch(clearQuizState());
      onOpenChange(false);
    } catch (error: any) {
      const msg = Array.isArray(error?.message) 
        ? error.message.join(", ") 
        : error?.message || "Lỗi khi lưu câu hỏi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (generatedQuestions.length === 0 && !loading && !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <Sparkles className="text-amber-500 w-6 h-6 animate-pulse" />
            Xem lại câu hỏi từ AI
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            AI đã tạo ra <strong>{Array.isArray(localQuestions) ? localQuestions.length : 0}</strong> câu hỏi. Bạn có thể tinh chỉnh nội dung trước khi lưu.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 mt-4 pr-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-8 pb-4">
            {Array.isArray(localQuestions) && localQuestions.map((q, qIndex) => (
              <div key={qIndex} className="p-6 border border-slate-100 rounded-2xl bg-white relative shadow-sm hover:shadow-md transition-all group">
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                   onClick={() => handleDeleteQuestion(qIndex)}
                >
                  <Trash2 size={20} />
                </Button>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-indigo-600 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Câu hỏi {qIndex + 1}
                    </Label>
                    <Input 
                        value={q.content} 
                        onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                        className="bg-slate-50 border-slate-200 rounded-xl font-bold text-slate-800 text-lg p-6 focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(q.options) && q.options.map((opt: any, oIndex: number) => (
                      <div 
                        key={oIndex} 
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                            opt.isCorrect 
                                ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                                : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <Checkbox 
                            id={`q-${qIndex}-o-${oIndex}`}
                            checked={opt.isCorrect}
                            onCheckedChange={(checked) => handleUpdateOption(qIndex, oIndex, { isCorrect: !!checked })}
                            className="w-5 h-5 rounded-full border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Input 
                            value={opt.text} 
                            onChange={(e) => handleUpdateOption(qIndex, oIndex, { text: e.target.value })}
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto text-sm font-medium bg-transparent text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-8 flex gap-3 border-t pt-6 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving} className="rounded-xl px-6">
            Hủy bỏ
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 min-w-[180px]" 
            onClick={handleSaveAll}
            disabled={saving || !Array.isArray(localQuestions) || localQuestions.length === 0}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu tất cả ({Array.isArray(localQuestions) ? localQuestions.length : 0} câu hỏi)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiQuizPreviewDialog;
