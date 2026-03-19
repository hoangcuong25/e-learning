"use client";

import { useState, useRef, useEffect } from "react";
import { chatLessonApi } from "@/store/api/common/ai.api";
import { Bot, SendHorizonal, User, AlertCircle, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LessonAiChatProps {
  lessonId: number;
}

export default function LessonAiChat({ lessonId }: LessonAiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là Trợ lý AI cho bài học này 🤖. Bạn có thể hỏi tôi bất cứ điều gì về nội dung Video bạn vừa xem nhé!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasContext, setHasContext] = useState<boolean | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatLessonApi({ question: trimmed, lessonId });
      setHasContext(res.hasContext);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Xin lỗi, đã xảy ra lỗi khi kết nối với máy chủ AI. Hãy thử lại sau.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "500px" }}>
      {/* Warning banner when no RAG context available */}
      {hasContext === false && (
        <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            Tài liệu của bài học này chưa được AI phân tích (video chưa được xử lý). Tôi đang trả lời theo kiến thức chung.
          </span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                  : "bg-blue-600 text-white rounded-tr-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200 bg-white shadow-sm">
              <Loader2 size={18} className="animate-spin text-blue-500" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Hỏi AI về nội dung bài học..."
          className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  );
}
