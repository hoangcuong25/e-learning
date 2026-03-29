"use client";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GenderEnum, GenderLabel } from "@/constants/gender.enum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/slice/common/userSlice";
import { updateUser } from "@/store/api/common/user.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormValues,
  profileSchema,
} from "@/hook/zod-schema/ProfileSchema";

const EditProfile = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      address: "",
      dob: "",
      gender: "" as GenderEnum,
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (avatarFile) formData.append("avatar", avatarFile);

      await updateUser(formData);
      await dispatch(fetchUser());
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật hồ sơ thất bại!");
    }
  };

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname || "");
      setValue("phone", user.phone || "");
      setValue("address", user.address || "");
      setValue(
        "dob",
        user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
      );
      setValue("gender", (user.gender as GenderEnum) || "");
      setPreview(user.avatar || "");
    }
  }, [user, setValue]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 transition-all uppercase tracking-widest text-[10px]">
          Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-10 pb-0">
          <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter">
            Cập nhật <span className="text-indigo-600">tài khoản</span>
          </DialogTitle>
          <p className="text-sm text-slate-400 font-medium tracking-tight">Cá nhân hóa hồ sơ của bạn để nổi bật hơn trong cộng đồng.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-10 py-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Avatar Section */}
          <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="relative group/avatar">
               <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-20 group-hover/avatar:opacity-40 transition" />
              <Image
                src={preview || "/default-avatar.png"}
                alt="avatar"
                className="relative w-24 h-24 rounded-full border-4 border-white object-cover shadow-xl"
                width={96}
                height={96}
              />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ảnh đại diện</p>
              <input
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="avatar"
                className="inline-flex cursor-pointer px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
              >
                Thay đổi ảnh
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Fullname */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</Label>
              <Input
                placeholder="Nhập họ và tên"
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold transition-all"
                {...register("fullname")}
              />
              {errors.fullname && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">{errors.fullname.message}</p>
              )}
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</Label>
              <Input
                disabled
                className="h-14 bg-slate-100 border-slate-200 rounded-2xl font-bold text-slate-400 cursor-not-allowed opacity-60"
                value={user?.email || ""}
              />
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</Label>
              <Input
                placeholder="Nhập số điện thoại"
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold transition-all"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">{errors.phone.message}</p>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày sinh</Label>
              <Input
                type="date"
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold transition-all"
                {...register("dob")}
              />
              {errors.dob && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">{errors.dob.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Gender */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới tính</Label>
              <Select
                value={watch("gender")}
                onValueChange={(val) => setValue("gender", val as GenderEnum)}
              >
                <SelectTrigger className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold ring-offset-0 transition-all">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  {Object.values(GenderEnum).map((gen) => (
                    <SelectItem key={gen} value={gen} className="rounded-xl font-bold text-slate-700 py-3">
                      {GenderLabel[gen]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">{errors.gender.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ</Label>
              <Input
                placeholder="Nhập địa chỉ"
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold transition-all"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">{errors.address.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 sm:justify-start">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi hồ sơ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default EditProfile;
