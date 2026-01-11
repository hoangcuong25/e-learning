"use client";

import { useState } from "react";
import { MoreVertical, Flag, RotateCcw } from "lucide-react";
import { ReportReason, ReportReasonTranslation } from "@/constants/report.enum";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { refundEnrollment } from "@/store/slice/enrollmentsSlice";
import { createReport } from "@/store/slice/reportSlice";
import { toast } from "sonner";

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

  // Report State
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState<string>(
    ReportReason.INAPPROPRIATE_CONTENT
  );

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

  const handleReport = async () => {
    if (!reportDescription.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết");
      return;
    }

    setLoading(true);
    try {
      const payloadDescription = `${reportDescription}`;

      await dispatch(
        createReport({
          targetType: "COURSE", // ReportTargetType.COURSE
          targetId: courseId,
          reason: reportType,
          description: payloadDescription,
        })
      ).unwrap();
      toast.success("Gửi báo cáo thành công");
      setOpenReportDialog(false);
      setReportDescription("");
      setReportType(ReportReason.INAPPROPRIATE_CONTENT);
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi gửi báo cáo");
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
      <Dialog open={openReportDialog} onOpenChange={setOpenReportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Báo cáo khóa học</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Loại báo cáo</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ReportReason).map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {ReportReasonTranslation[reason]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea
                id="description"
                placeholder="Mô tả vấn đề bạn gặp phải..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenReportDialog(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleReport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Đang gửi..." : "Gửi báo cáo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
