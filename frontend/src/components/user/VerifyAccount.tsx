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
import { BookOpenCheck } from "lucide-react";
import { ActiveAccountApi, SendEmailActiveApi } from "@/api/auth.api";
import { toast } from "sonner";
import { useState } from "react";
import { fetchUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const VerifyAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState("");

  const handleSendEmailActive = async () => {
    try {
      await SendEmailActiveApi();
      toast.success("Mã OTP đã được gửi đến email của bạn.");
    } catch (error) {
      toast.error("Gửi mã OTP thất bại. Vui lòng thử lại.");
    }
  };

  const handleVerifyAccount = async () => {
    try {
      await ActiveAccountApi(otp);
      dispatch(fetchUser());

      toast.success("Xác thực tài khoản e-Learning thành công!");
    } catch (error) {
      toast.error("Mã OTP không hợp lệ. Vui lòng thử lại.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 flex items-center gap-2 rounded-xl shadow-md transition-all">
          <BookOpenCheck className="w-4 h-4" />
          Xác thực tài khoản học viên
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white rounded-2xl border border-indigo-100 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            Xác thực tài khoản e-Learning
          </AlertDialogTitle>

          <p className="mb-4 text-gray-600 leading-relaxed">
            Vui lòng nhập <strong>mã OTP</strong> đã được gửi đến email của bạn
            để kích hoạt tài khoản học tập. Mã OTP có hiệu lực trong{" "}
            <b>5 phút</b>.
          </p>

          <div className="self-center flex justify-center">
            <InputOTP
              maxLength={6}
              onChange={setOtp}
              value={otp}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="border-2 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-lg"
                />
                <InputOTPSlot
                  index={1}
                  className="border-2 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-lg"
                />
                <InputOTPSlot
                  index={2}
                  className="border-2 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-lg"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="border-2 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-lg"
                />
                <InputOTPSlot
                  index={4}
                  className="border-2 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-lg"
                />
                <InputOTPSlot
                  index={5}
                  className="border-2 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-lg"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-5 flex justify-between">
          <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
            Hủy
          </AlertDialogCancel>

          <div className="flex gap-2">
            <Button
              onClick={handleSendEmailActive}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-300 rounded-lg"
            >
              Gửi mã OTP
            </Button>

            <AlertDialogAction
              onClick={handleVerifyAccount}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg"
            >
              Xác nhận
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyAccount;
