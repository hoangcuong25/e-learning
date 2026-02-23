"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Send,
  Settings,
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAlgorithmProblemBySlug,
  submitAlgorithm,
  fetchSubmissionStatus,
  resetCurrentProblem,
} from "@/store/slice/common/algorithmSlice";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProblemDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentProblem: problem,
    loading: isProblemLoading,
    submitting: isSubmitting,
    currentSubmission: submissionStatus,
  } = useSelector((state: RootState) => state.algorithm);

  const [code, setCode] = useState("// Bắt đầu code ở đây...");
  const [language, setLanguage] = useState("JAVASCRIPT");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (slug) {
      dispatch(fetchAlgorithmProblemBySlug(slug as string));
    }
    return () => {
      dispatch(resetCurrentProblem());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (submissionStatus?.id && submissionStatus.status === "PENDING") {
      interval = setInterval(() => {
        dispatch(fetchSubmissionStatus(submissionStatus.id));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dispatch, submissionStatus?.id, submissionStatus?.status]);

  useEffect(() => {
    if (problem) {
      if (language === "JAVASCRIPT")
        setCode(
          `/**\n * @param {Array} nums\n * @param {number} target\n * @return {Array}\n */\nfunction solution(nums, target) {\n  // Viết code của bạn ở đây\n}`
        );
      if (language === "PYTHON")
        setCode(
          `def solution(nums, target):\n    # Viết code của bạn ở đây\n    pass`
        );
    }
  }, [problem, language]);

  const handleSubmit = async () => {
    if (!problem) return;
    try {
      await dispatch(
        submitAlgorithm({
          problemId: problem.id,
          code,
          language,
        })
      ).unwrap();

      setActiveTab("submissions");
      toast.success("Đã nộp bài, đang chờ kết quả...");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nộp bài");
    }
  };

  if (isProblemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!problem) {
    return <div>Không tìm thấy bài tập</div>;
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link
            href="/smart-hub/algorithms"
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-slate-800">{problem.title}</h1>
            <Badge
              variant="outline"
              className={`${
                problem.difficulty === "EASY"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : problem.difficulty === "MEDIUM"
                  ? "bg-amber-50 text-amber-600 border-amber-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              } text-[10px] font-bold`}
            >
              {problem.difficulty}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32 h-9 rounded-lg bg-slate-50 border-transparent text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
              <SelectItem value="PYTHON">Python</SelectItem>
              <SelectItem value="JAVA">Java</SelectItem>
              <SelectItem value="CPP">C++</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
            <Settings className="w-4 h-4 text-slate-500" />
          </Button>
        </div>
      </header>

      {/* Main Content Split View */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Description */}
        <div className="w-[40%] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="bg-white border-b border-slate-100 rounded-none px-4 h-11 shrink-0 justify-start gap-4">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs font-bold px-0 h-11 px-4"
              >
                Mô tả
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs font-bold px-0 h-11 px-4"
              >
                Lịch sử nộp bài
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="description"
              className="flex-1 overflow-y-auto p-8 custom-scrollbar m-0"
            >
              <article className="prose prose-slate max-w-none prose-sm">
                <ReactMarkdown>{problem.description}</ReactMarkdown>

                <div className="mt-8 space-y-6">
                  {problem.testCases?.map((tc: any, i: number) => (
                    <div key={tc.id} className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Ví dụ {i + 1}
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 font-mono text-xs">
                        <div>
                          <span className="text-slate-400">Input:</span>{" "}
                          {tc.input}
                        </div>
                        <div>
                          <span className="text-slate-400">Output:</span>{" "}
                          {tc.expectedOutput}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 pt-6 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Ràng buộc
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Thời gian giới hạn: {problem.timeLimit}ms</li>
                      <li>Bộ nhớ giới hạn: {problem.memoryLimit}MB</li>
                    </ul>
                  </div>
                </div>
              </article>
            </TabsContent>

            <TabsContent
              value="submissions"
              className="flex-1 overflow-y-auto p-4 m-0 bg-slate-50/50"
            >
              {submissionStatus && (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-500 uppercase">
                        Kết quả nộp bài
                      </div>
                      {submissionStatus?.status === "PENDING" ? (
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" /> Đang
                          chấm...
                        </div>
                      ) : submissionStatus?.status === "ACCEPTED" ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" /> Chấp nhận
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                          <XCircle className="w-4 h-4" /> Sai kết quả
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Thời gian
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {submissionStatus?.executionTime || "--"} ms
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                        <Database className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Bộ nhớ
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {submissionStatus?.memoryUsed || "--"} KB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!submissionStatus && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Play className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">
                    Chưa có lượt nộp bài nào
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Editor */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={language.toLowerCase()}
              language={language.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: false,
                padding: { top: 20 },
                fontFamily: "var(--font-mono)",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
              }}
            />
          </div>

          <div className="absolute bottom-6 right-8 flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-xl px-6 h-12 font-bold shadow-lg shadow-slate-200"
            >
              Chạy thử
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold shadow-xl shadow-blue-600/30 gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Nộp bài
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemDetailPage;
