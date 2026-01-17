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
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import { updateUser } from "@/api/user.api";
import { toast } from "sonner";
import { GenderEnum, GenderLabel } from "@/constants/Gender";

const EditProfile = () => {
  const { user } = useContext(AppContext);

  const [updateInfo, setUpdateInfo] = useState({
    fullname: "",
    phone: "",
    address: "",
    dob: "",
    avatar: "",
    gender: "",
  });

  const [preview, setPreview] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setUpdateInfo({ ...updateInfo, avatar: file.name });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("fullname", updateInfo.fullname);
      formData.append("phone", updateInfo.phone);
      formData.append("address", updateInfo.address);
      formData.append("dob", updateInfo.dob);
      formData.append("gender", updateInfo.gender);
      if (preview) {
        formData.append("avatar", preview);
      }

      await updateUser(formData);

      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      toast.error("Cập nhật hồ sơ thất bại");
    }
  };

  useEffect(() => {
    if (user) {
      setUpdateInfo({
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        avatar: user.avatar || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-emerald-500 hover:bg-emerald-600">
          Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin hồ sơ</DialogTitle>
        </DialogHeader>

        <form onSubmit={updateProfile} className="space-y-4 py-2">
          {/* Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Ảnh đại diện</Label>
            {preview ? (
              <Image
                src={preview || "/default-avatar.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-emerald-500 object-cover"
                width={80}
                height={80}
              />
            ) : (
              <>
                <Image
                  src={updateInfo.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-20 h-20 rounded-full border-4 border-emerald-500 object-cover"
                  width={80}
                  height={80}
                />
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer w-28 h-8 flex items-center justify-center border rounded px-2 text-sm"
                >
                  Chọn ảnh
                </label>
              </>
            )}
          </div>

          {/* Fullname */}
          <div className="space-y-2">
            <Label htmlFor="fullname">Họ và tên</Label>
            <Input
              id="fullname"
              type="text"
              placeholder="Nhập họ và tên"
              value={updateInfo.fullname}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, fullname: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled
              className="bg-gray-100"
              value={user?.email || ""}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Nhập số điện thoại"
              value={updateInfo.phone}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, phone: e.target.value })
              }
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              type="text"
              placeholder="Nhập địa chỉ"
              value={updateInfo.address}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, address: e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <Select
            value={updateInfo.gender}
            onValueChange={(val) =>
              setUpdateInfo({ ...updateInfo, gender: val as GenderEnum })
            }
          >
            <SelectTrigger>
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

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob">Ngày sinh</Label>
            <Input
              id="dob"
              type="date"
              value={updateInfo.dob}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, dob: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
