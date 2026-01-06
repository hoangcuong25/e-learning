import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchQuestions,
  createQuestion,
  createAnswer,
  createReply,
} from "@/store/slice/lessonDiscussionSlice";
import { toast } from "sonner";

export const useLessonDiscussion = (lessonId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const [questionContent, setQuestionContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const refetchQuestions = useCallback(() => {
    if (lessonId) {
      dispatch(fetchQuestions(lessonId));
    }
  }, [dispatch, lessonId]);

  useEffect(() => {
    refetchQuestions();
  }, [refetchQuestions]);

  const handlePostQuestion = async () => {
    if (!questionContent.trim()) return;
    try {
      await dispatch(
        createQuestion({ lessonId, content: questionContent })
      ).unwrap();
      setQuestionContent("");
      toast.success("Đã đăng câu hỏi thành công!");
      refetchQuestions();
    } catch (error) {
      toast.error("Không thể đăng câu hỏi. Vui lòng thử lại.");
    }
  };

  const handlePostAnswer = async (questionId: number) => {
    const content = replyContent[`q-${questionId}`];
    if (!content?.trim()) return;

    try {
      await dispatch(createAnswer({ questionId, content })).unwrap();
      setReplyContent((prev) => ({ ...prev, [`q-${questionId}`]: "" }));
      setActiveReplyId(null);
      toast.success("Đã đăng câu trả lời!");
      refetchQuestions();
    } catch (error) {
      toast.error("Lỗi khi đăng câu trả lời.");
    }
  };

  const handlePostReply = async (answerId: number, questionId: number) => {
    const content = replyContent[`a-${answerId}`];
    if (!content?.trim()) return;

    try {
      await dispatch(createReply({ answerId, questionId, content })).unwrap();
      setReplyContent((prev) => ({ ...prev, [`a-${answerId}`]: "" }));
      setActiveReplyId(null);
      toast.success("Đã đăng phản hồi!");
      refetchQuestions();
    } catch (error) {
      toast.error("Lỗi khi đăng phản hồi.");
    }
  };

  const toggleReplyForm = (id: string) => {
    setActiveReplyId(activeReplyId === id ? null : id);
  };

  const handleContentChange = (id: string, value: string) => {
    setReplyContent((prev) => ({ ...prev, [id]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    questionContent,
    setQuestionContent,
    replyContent,
    activeReplyId,
    handlePostQuestion,
    handlePostAnswer,
    handlePostReply,
    toggleReplyForm,
    handleContentChange,
    formatDate,
    refetchQuestions,
  };
};
