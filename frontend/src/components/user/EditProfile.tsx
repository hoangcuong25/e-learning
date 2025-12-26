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
import { GenderEnum, GenderLabel } from "@/constants/Gender";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/userSlice";
import { updateUser } from "@/api/user.api";
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

  // 🔧 react-hook-form + zod
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

  // 📷 Upload avatar preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  // 📦 Submit form
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

  // 🪄 Load dữ liệu user hiện tại
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200">
          Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600 text-center">
            Cập nhật thông tin hồ sơ ✏️
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Avatar */}
          <div className="space-y-2">
            <Label className="text-blue-700 font-medium">Ảnh đại diện</Label>
            <div className="flex items-center gap-4">
              <Image
                src={preview || "/default-avatar.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover shadow-sm"
                width={80}
                height={80}
              />
              <div>
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 transition-all"
                >
                  Chọn ảnh
                </label>
              </div>
            </div>
          </div>

          {/* Fullname */}
          <div className="space-y-1">
            <Label htmlFor="fullname" className="text-blue-700 font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullname"
              placeholder="Nhập họ và tên"
              className="border-blue-300 rounded-lg"
              {...register("fullname")}
            />
            {errors.fullname && (
              <p className="text-sm text-red-500">{errors.fullname.message}</p>
            )}
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              disabled
              className="bg-gray-100 border-blue-300 text-gray-700 rounded-lg"
              value={user?.email || ""}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-blue-700 font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              className="border-blue-300 rounded-lg"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <Label htmlFor="address" className="text-blue-700 font-medium">
              Địa chỉ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Nhập địa chỉ"
              className="border-blue-300 rounded-lg"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <Label className="text-blue-700 font-medium">
              Giới tính <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("gender")}
              onValueChange={(val) => setValue("gender", val as GenderEnum)}
            >
              <SelectTrigger className="border-blue-300 rounded-lg">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GenderEnum.Male}>
                  {GenderLabel[GenderEnum.Male]}
                </SelectItem>
                <SelectItem value={GenderEnum.Female}>
                  {GenderLabel[GenderEnum.Female]}
                </SelectItem>
                <SelectItem value={GenderEnum.Other}>
                  {GenderLabel[GenderEnum.Other]}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <Label htmlFor="dob" className="text-blue-700 font-medium">
              Ngày sinh <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              className="border-blue-300 rounded-lg"
              {...register("dob")}
            />
            {errors.dob && (
              <p className="text-sm text-red-500">{errors.dob.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 shadow-md transition-all duration-200"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
