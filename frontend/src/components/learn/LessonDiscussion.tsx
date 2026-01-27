"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchQuestions,
  deleteMyQuestion,
  deleteMyAnswer,
  createQuestion,
  createAnswer,
  createReply,
} from "@/store/slice/lessonDiscussionSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  MoreVertical,
  Trash2,
  Reply as ReplyIcon,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteQuestionAlertProps {
  questionId: number;
  onDeleteSuccess: () => void;
}

const DeleteQuestionAlert: React.FC<DeleteQuestionAlertProps> = ({
  questionId,
  onDeleteSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteQuestion = async () => {
    try {
      await dispatch(deleteMyQuestion(questionId)).unwrap();
      await dispatch(fetchQuestions(questionId)).unwrap();
      onDeleteSuccess();
      toast.success("Đã xóa câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa câu hỏi. Vui lòng thử lại.");
      console.error("Delete Question Error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* Nút trigger Alert Dialog thay thế cho DropdownMenuTrigger */}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Câu hỏi sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteQuestion} // Gọi hàm xóa khi người dùng xác nhận
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface DeleteAnswerAlertProps {
  answerId: number;
  questionId: number;
  replyId?: number;
  onDeleteSuccess: () => void;
}

const DeleteAnswerAlert: React.FC<DeleteAnswerAlertProps> = ({
  answerId,
  questionId,
  replyId,
  onDeleteSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isReply = replyId !== undefined;

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteMyAnswer({ id: answerId, questionId, answerId: replyId })
      ).unwrap();
      onDeleteSuccess();
      toast.success(`Đã xóa ${isReply ? "phản hồi" : "câu trả lời"}!`);
    } catch (error) {
      toast.error(`Lỗi khi xóa ${isReply ? "phản hồi" : "câu trả lời"}.`);
      console.error("Delete Answer/Reply Error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-${isReply ? 5 : 6} w-${
            isReply ? 5 : 6
          } text-gray-400 hover:text-red-500`}
        >
          <Trash2 size={isReply ? 10 : 12} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Xóa {isReply ? "phản hồi" : "câu trả lời"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa {isReply ? "phản hồi" : "câu trả lời"} này
            không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface LessonDiscussionProps {
  lessonId: number;
}

const LessonDiscussion: React.FC<LessonDiscussionProps> = ({ lessonId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { questions, loading } = useSelector(
    (state: RootState) => state.lessonDiscussion
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [questionContent, setQuestionContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const refetchQuestions = () => {
    dispatch(fetchQuestions(lessonId));
  };

  useEffect(() => {
    if (lessonId) {
      refetchQuestions();
    }
  }, [dispatch, lessonId]);

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

  return (
    <div className="space-y-8">
      {/* Post Question Form */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="text-blue-600" size={20} />
          Đặt câu hỏi mới
        </h3>
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.fullname?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Bạn đang thắc mắc điều gì?"
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              className="min-h-[100px] resize-none focus-visible:ring-blue-500"
            />
            <div className="flex justify-end">
              <Button
                onClick={handlePostQuestion}
                disabled={!questionContent.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} className="mr-2" /> Gửi câu hỏi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {loading && questions.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-xl border shadow-sm"
            >
              {/* Question Header */}
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={question.user.avatar} />
                  <AvatarFallback>{question.user.fullname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {question.user.fullname}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(question.createdAt)}
                      </p>
                    </div>
                    {user?.id === question.user.id && (
                      <DeleteQuestionAlert
                        questionId={question.id}
                        onDeleteSuccess={refetchQuestions}
                      />
                    )}
                  </div>
                  <p className="mt-2 text-gray-800 leading-relaxed">
                    {question.content}
                  </p>

                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplyForm(`q-${question.id}`)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2"
                    >
                      <ReplyIcon size={14} className="mr-1" /> Trả lời
                    </Button>
                  </div>

                  {/* Reply Form for Question */}
                  {activeReplyId === `q-${question.id}` && (
                    <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Viết câu trả lời..."
                          value={replyContent[`q-${question.id}`] || ""}
                          onChange={(e) =>
                            handleContentChange(`q-${question.id}`, e.target.value)
                          }
                          className="min-h-[80px] text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplyForm(`q-${question.id}`)}
                          >
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePostAnswer(question.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Trả lời
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Answers List */}
              {question.answers && question.answers.length > 0 && (
                <div className="mt-6 pl-14 space-y-6 border-l-2 border-gray-100 ml-5">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="relative">
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={answer.user.avatar} />
                          <AvatarFallback>
                            {answer.user.fullname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none">
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-sm text-gray-900">
                                {answer.user.fullname}
                              </span>
                              {user?.id === answer.user.id && (
                                <DeleteAnswerAlert
                                  answerId={answer.id}
                                  questionId={question.id}
                                  onDeleteSuccess={refetchQuestions}
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {answer.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 ml-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(answer.createdAt)}
                            </span>
                            <button
                              onClick={() => toggleReplyForm(`a-${answer.id}`)}
                              className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1"
                            >
                              <ReplyIcon size={12} /> Phản hồi
                            </button>
                          </div>

                          {/* Reply Form for Answer */}
                          {activeReplyId === `a-${answer.id}` && (
                            <div className="mt-3 flex gap-3">
                              <div className="flex-1 space-y-2">
                                <Textarea
                                  placeholder="Viết phản hồi..."
                                  value={replyContent[`a-${answer.id}`] || ""}
                                  onChange={(e) =>
                                    handleContentChange(
                                      `a-${answer.id}`,
                                      e.target.value
                                    )
                                  }
                                  className="min-h-[60px] text-sm"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleReplyForm(`a-${answer.id}`)}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handlePostReply(answer.id, question.id)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Gửi
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Replies List */}
                          {answer.replies && answer.replies.length > 0 && (
                            <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
                              {answer.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={reply.user.avatar} />
                                    <AvatarFallback>
                                      {reply.user.fullname[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 p-2 rounded-lg rounded-tl-none">
                                      <div className="flex justify-between items-start">
                                        <span className="font-semibold text-xs text-gray-900">
                                          {reply.user.fullname}
                                        </span>
                                        {user?.id === reply.user.id && (
                                          <DeleteAnswerAlert
                                            answerId={reply.id}
                                            questionId={question.id}
                                            replyId={answer.id}
                                            onDeleteSuccess={refetchQuestions}
                                          />
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-700 mt-1">
                                        {reply.content}
                                      </p>
                                    </div>
                                    <span className="text-[10px] text-gray-500 ml-1">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonDiscussion;