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
import { refundEnrollment } from "@/store/slice/enrollmentsSlice";
import { toast } from "sonner";

interface CourseMoreActionsProps {
  enrollmentId: number;
}

export function CourseMoreActions({ enrollmentId }: CourseMoreActionsProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [openMenu, setOpenMenu] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
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

          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700">
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
              Bạn có chắc chắn muốn hoàn tiền cho khóa học này không?
              <br />
              <span className="text-red-500 font-medium">
                Hành động này không thể hoàn tác.
              </span>
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
    </>
  );
}
