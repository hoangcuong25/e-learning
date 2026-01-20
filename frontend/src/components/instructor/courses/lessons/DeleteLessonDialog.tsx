"use client";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteLesson } from "@/store/lessonsSlice";
import { toast } from "sonner";
import { fetchCourseById } from "@/store/coursesSlice";

const DeleteLessonDialog = ({
  lessonId,
  lessonTitle,
  courseId,
}: {
  lessonId: number;
  lessonTitle: string;
  courseId: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    try {
      await dispatch(deleteLesson(lessonId)).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();
      toast.success(`Đã xóa bài học thành công!`);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Xóa bài học thất bại, vui lòng thử lại.";
      toast.error(message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 size={16} /> Xóa
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn xóa bài học "{lessonTitle}"?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLessonDialog;
