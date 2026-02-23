"use client";

import { useState } from "react";
import { MoreVertical, Flag, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { refundEnrollment } from "@/store/slice/course/enrollmentsSlice";
import { toast } from "sonner";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { ReportTargetType } from "@/constants/report.enum";

interface CourseMoreActionsProps {
  enrollmentId: number;
  courseId: number;
}

export function CourseMoreActions({
  enrollmentId,
  courseId,
}: CourseMoreActionsProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [openMenu, setOpenMenu] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    setLoading(true);
    try {
      await dispatch(refundEnrollment(enrollmentId)).unwrap();
      toast.success("Hoàn tiền thành công");
      setOpenRefundDialog(false);
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi hoàn tiền");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ DropdownMenu with controlled open */}
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="cursor-pointer text-yellow-600 focus:text-yellow-700"
            onSelect={() => {
              setOpenMenu(false);
              setOpenRefundDialog(true);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Hoàn tiền
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-700"
            onSelect={() => {
              setOpenMenu(false);
              setOpenReportDialog(true);
            }}
          >
            <Flag className="w-4 h-4 mr-2" />
            Báo cáo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ✅ AlertDialog tách biệt */}
      <AlertDialog open={openRefundDialog} onOpenChange={setOpenRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn tiền</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-red-500 font-medium">
                Bạn có chắc chắn muốn hoàn tiền cho khóa học này không?
              </span>
              <br />
              Lưu ý: Bạn sẽ chỉ có thể hoàn tiền trong vòng 1 tiếng sau khi đăng
              ký khóa học và khóa học được hoàn thành nhiều nhất là 30%. Bạn sẽ
              chỉ nhận được 80% số tiền đã thanh toán.
              <br />
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefund}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              {loading ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 🚩 Report Dialog */}
      <ReportDialog
        open={openReportDialog}
        onOpenChange={setOpenReportDialog}
        targetType={ReportTargetType.COURSE}
        targetId={courseId}
      />
    </>
  );
}
