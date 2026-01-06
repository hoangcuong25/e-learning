import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  deleteMyQuestion,
  deleteMyAnswer,
} from "@/store/slice/lessonDiscussionSlice";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
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

export const DeleteQuestionAlert: React.FC<DeleteQuestionAlertProps> = ({
  questionId,
  onDeleteSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteQuestion = async () => {
    try {
      await dispatch(deleteMyQuestion(questionId)).unwrap();
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
            onClick={handleDeleteQuestion}
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

export const DeleteAnswerAlert: React.FC<DeleteAnswerAlertProps> = ({
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
