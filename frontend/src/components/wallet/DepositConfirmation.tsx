"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createDepositApi } from "@/store/api/payment.api";
import usePaymentSocket from "@/hook/socket/usePaymentSocket";
import { fetchUser } from "@/store/slice/userSlice";

interface DepositWatcherProps {
  depositInfo: any;
  onSuccess: () => void;
  onClose: () => void;
}

const DepositWatcher: React.FC<DepositWatcherProps> = ({
  depositInfo,
  onSuccess,
  onClose,
}) => {
  const socket = usePaymentSocket();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handlePaymentSuccess = useCallback(() => {
    toast.success("Nạp tiền thành công! Số dư đã được cập nhật.");
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(fetchUser());
    }
    onSuccess();
    onClose();
  }, [onSuccess, onClose]);

  useEffect(() => {
    if (!socket || !depositInfo || !user) return;

    const transactionId = depositInfo.id;

    socket.emit("joinPaymentStatus", transactionId);
    socket.on("paymentSuccess", handlePaymentSuccess);

    return () => {
      socket.off("paymentSuccess", handlePaymentSuccess);
      socket.emit("leavePaymentStatus", transactionId);
    };
  }, [socket, depositInfo, user, handlePaymentSuccess]);

  return (
    <div className="mt-4 text-center">
      <p className="text-gray-700 mb-3">
        Quét mã QR dưới đây bằng app ngân hàng để nạp tiền:
      </p>
      <img
        src={depositInfo.qrCode}
        alt="QR Code"
        className="mx-auto w-48 h-48 border rounded-lg shadow-sm"
      />
      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm text-left">
        <p>
          <strong>Ngân hàng:</strong> {depositInfo.bankAccount}
        </p>
        <p>
          <strong>Nội dung chuyển khoản:</strong>{" "}
          <span className="font-mono text-blue-600">{depositInfo.content}</span>
        </p>
        <p>
          <strong>Số tiền:</strong> {depositInfo.amount.toLocaleString()} đ
        </p>
        <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Đang chờ giao dịch hoàn
          tất...
        </p>
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};

interface DepositConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDepositSuccess: () => void;
}

export const DepositConfirmationDialog: React.FC<
  DepositConfirmationDialogProps
> = ({ isOpen, setIsOpen, onDepositSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [depositInfo, setDepositInfo] = useState<any | null>(null);

  const handleCloseDialog = () => {
    setIsOpen(false);

    setDepositInfo(null);
    setAmount(0);
  };

  const handleDeposit = async () => {
    if (amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      const res = await createDepositApi({ amount });

      toast.success("Yêu cầu nạp tiền đã được tạo! Vui lòng quét mã QR.");
      setDepositInfo(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Tạo yêu cầu nạp tiền thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulTransaction = () => {
    onDepositSuccess();
    handleCloseDialog();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCloseDialog();
        else setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nạp tiền vào ví</DialogTitle>
        </DialogHeader>

        {!depositInfo ? (
          <div className="mt-4">
            {/* Phần nhập số tiền */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập số tiền cần nạp (LearnCoin)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số tiền..."
            />
            <div className="mt-6 flex justify-end">
              <Button
                disabled={loading}
                onClick={handleDeposit}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác nhận nạp
              </Button>
            </div>
          </div>
        ) : (
          <DepositWatcher
            depositInfo={depositInfo}
            onSuccess={handleSuccessfulTransaction}
            onClose={handleCloseDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
