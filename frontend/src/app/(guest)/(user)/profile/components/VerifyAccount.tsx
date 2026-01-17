"use client";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { ActiveAccountApi, SendEmailActiveApi } from "@/api/auth.api";
import { toast } from "sonner";
import { useState } from "react";

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");

  const handleSendEmailActive = async () => {
    try {
      await SendEmailActiveApi();
      // Thông báo thành công
      toast.success("Mã OTP đã được gửi đến email của bạn.");
    } catch (error) {
      // Xử lý lỗi
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleVerifyAccount = async () => {
    try {
      await ActiveAccountApi(otp);

      toast.success("Xác thực tài khoản thành công.");
    } catch (error) {
      toast.error("Xác thực tài khoản thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Xác thực tài khoản
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-800 mb-2">
            Xác thực tài khoản
          </AlertDialogTitle>
          <p className="mb-4 text-gray-600">
            Vui lòng nhập mã OTP đã được gửi đến email của bạn để xác thực tài
            khoản. Mã OTP có hiệu lực trong 5 phút.
          </p>

          <div className="self-center">
            <InputOTP maxLength={6} onChange={setOtp} value={otp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button onClick={handleSendEmailActive}>Gửi mã OTP</Button>
          <AlertDialogAction onClick={handleVerifyAccount}>
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyAccount;
