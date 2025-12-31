"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  deleteCourse,
  fetchCoursesByInstructor,
} from "@/store/slice/coursesSlice";
import { toast } from "sonner";

interface DeleteCourseDialogProps {
  courseId: number;
  courseTitle: string;
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  courseId,
  courseTitle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await dispatch(deleteCourse(courseId)).unwrap();
      await dispatch(fetchCoursesByInstructor()).unwrap();
      setOpen(false);

      toast.success("Xóa khóa học thành công!");
    } catch (error) {
      toast.error("Xóa khóa học thất bại. Vui lòng thử lại.");
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4" /> Xóa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa khóa học</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa{" "}
            <span className="font-semibold">{courseTitle}</span>? Hành động này
            không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
