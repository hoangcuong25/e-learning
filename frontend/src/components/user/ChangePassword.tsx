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
import { changePassword } from "@/store/api/user.api";

// Input có toggle ẩn/hiện mật khẩu
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
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10 border-blue-300 focus:ring-blue-400 focus:border-blue-400 rounded-xl transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Đổi mật khẩu
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-700">
            Đổi mật khẩu 🔒
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleChangePassword} className="space-y-5 mt-2">
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

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-2 transition-all duration-200"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
