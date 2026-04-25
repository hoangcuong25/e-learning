"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchCourseById } from "@/store/slice/course/coursesSlice";
import { deleteChapter } from "@/store/slice/course/chapterSlice";

interface DeleteChapterDialogProps {
  courseId: number;
  chapterId: number;
  chapterTitle: string;
}

const DeleteChapterDialog = ({
  courseId,
  chapterId,
  chapterTitle,
}: DeleteChapterDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteChapter({ courseId, id: chapterId })).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();
      toast.success("Xóa chương thành công!");
    } catch (err) {
      toast.error("Không thể xóa chương, vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black text-slate-900">
            Xác nhận xóa chương?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 font-medium">
            Bạn có chắc chắn muốn xóa chương <span className="text-slate-900 font-bold">"{chapterTitle}"</span>? 
            Hành động này sẽ xóa tất cả các bài học và nội dung bên trong chương này và không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="rounded-2xl font-bold border-slate-200 hover:bg-slate-50 text-slate-600">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-100"
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChapterDialog;
