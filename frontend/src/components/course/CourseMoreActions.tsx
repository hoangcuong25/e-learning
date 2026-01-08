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

enum CourseReportType {
  INAPPROPRIATE = "INAPPROPRIATE",
  VIOLENCE = "VIOLENCE",
  OTHER = "OTHER",
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

  // Report form state
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState<string>(
    CourseReportType.INAPPROPRIATE
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
    if (!reportTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề báo cáo");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createReport({
          courseId,
          title: reportTitle,
          description: reportDescription,
          type: reportType,
        })
      ).unwrap();
      toast.success("Gửi báo cáo thành công");
      setOpenReportDialog(false);
      setReportTitle("");
      setReportDescription("");
      setReportType(CourseReportType.INAPPROPRIATE);
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
              className="bg-red-600 hover:bg-red-700"
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
                  <SelectItem value={CourseReportType.INAPPROPRIATE}>
                    Nội dung không phù hợp
                  </SelectItem>
                  <SelectItem value={CourseReportType.VIOLENCE}>
                    Bạo lực
                  </SelectItem>
                  <SelectItem value={CourseReportType.OTHER}>Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề báo cáo..."
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
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
