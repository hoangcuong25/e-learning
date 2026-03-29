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
import {
  ActiveAccountApi,
  SendEmailActiveApi,
} from "@/store/api/common/auth.api";
import { toast } from "sonner";
import { useState } from "react";
import { fetchUser } from "@/store/slice/common/userSlice";
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
      toast.success("Xác thực tài khoản thành công!");
    } catch (error) {
      toast.error("Mã OTP không hợp lệ. Vui lòng thử lại.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-[10px] flex items-center gap-3">
          <BookOpenCheck className="w-5 h-5" />
          Kích hoạt tài khoản
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl p-0 overflow-hidden">
        <AlertDialogHeader className="p-10 pb-0 space-y-4">
          <AlertDialogTitle className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <BookOpenCheck size={24} />
             </div>
             Xác thực <span className="text-indigo-600">tài khoản</span>
          </AlertDialogTitle>
          <p className="text-sm text-slate-400 font-medium tracking-tight leading-relaxed">
            Vui lòng nhập <strong>mã OTP</strong> gồm 6 chữ số đã được gửi đến email của bạn. Mã có hiệu lực trong vòng <span className="text-indigo-600 font-bold">5 phút</span>.
          </p>
        </AlertDialogHeader>

        <div className="px-10 py-8 flex justify-center">
            <InputOTP
              maxLength={6}
              onChange={setOtp}
              value={otp}
              className="gap-3"
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2].map((i) => (
                   <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-16 border-2 border-slate-100 bg-slate-50 text-slate-900 font-black text-xl rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator className="text-slate-200" />
              <InputOTPGroup className="gap-2">
                {[3, 4, 5].map((i) => (
                   <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-16 border-2 border-slate-100 bg-slate-50 text-slate-900 font-black text-xl rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
        </div>

        <AlertDialogFooter className="px-10 pb-10 sm:justify-start gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="ghost"
              onClick={handleSendEmailActive}
              className="h-14 flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-xs"
            >
              Gửi lại mã OTP
            </Button>

            <AlertDialogAction
              onClick={handleVerifyAccount}
              className="h-14 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-[11px]"
            >
              Xác nhận ngay
            </AlertDialogAction>
          </div>
          
          <div className="w-full flex justify-center">
             <AlertDialogCancel className="h-10 px-6 bg-white border-none shadow-none text-slate-400 hover:text-slate-600 hover:bg-transparent transition-colors font-bold text-[10px] uppercase tracking-widest">
                Đóng cửa sổ
             </AlertDialogCancel>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export default VerifyAccount;
