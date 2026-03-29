"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/store/api/common/user.api";

const PasswordInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-3">
      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</Label>
      <div className="relative group/input">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 pr-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPwd !== confirmPwd) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        oldPassword: currentPwd,
        newPassword1: newPwd,
        newPassword2: confirmPwd,
      });
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Đổi mật khẩu thất bại! Vui lòng kiểm tra lại mật khẩu hiện tại.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 px-8 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px] flex items-center gap-3">
          <Lock className="w-4 h-4 text-indigo-600" />
          Đổi mật khẩu
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-10 pb-0">
          <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter">
            Bảo mật <span className="text-indigo-600">tài khoản</span>
          </DialogTitle>
          <p className="text-sm text-slate-400 font-medium tracking-tight">Vui lòng nhập mật khẩu mới để tăng cường bảo mật cho bạn.</p>
        </DialogHeader>

        <form onSubmit={handleChangePassword} className="px-10 py-8 space-y-6 mt-2">
          <PasswordInput
            label="Mật khẩu hiện tại"
            value={currentPwd}
            onChange={setCurrentPwd}
          />
          <PasswordInput
            label="Mật khẩu mới"
            value={newPwd}
            onChange={setNewPwd}
          />
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={confirmPwd}
            onChange={setConfirmPwd}
          />

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu ngay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default ChangePassword;
