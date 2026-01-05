"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X, ChevronDown, Check, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  updateCourse,
  fetchCoursesByInstructor,
} from "@/store/slice/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import RichTextEditor from "@/components/RichTextEditor";

interface Props {
  course: any;
}

interface CourseFormData {
  title: string;
  description: string;
  price?: number;
  type?: string;
  thumbnail?: File | string;
  specializationIds: number[];
}

export default function UpdateCourse({ course }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorSpecializaions, loading: specializationLoading } =
    useSelector((state: RootState) => state.specialization);

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    course.thumbnail || null
  );
  const [file, setFile] = useState<File | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>(
    course.specializations?.map((s: any) => s.specializationId) || []
  );
  const [courseType, setCourseType] = useState<"FREE" | "PAID">(
    course.type || "FREE"
  );
  const [selectPublic, setSelectPublic] = useState(
    (course.isPublished || false).toString()
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: course.title,
      description: course.description,
      price: course.price,
      type: course.type,
      specializationIds:
        course.specializations?.map((s: any) => s.specializationId) || [],
    },
  });

  const toggleSelect = (id: number) => {
    const updated = selectedSpecs.includes(id)
      ? selectedSpecs.filter((item) => item !== id)
      : [...selectedSpecs, id];
    setSelectedSpecs(updated);
    setValue("specializationIds", updated);
  };

  const removeSpec = (id: number) => {
    const updated = selectedSpecs.filter((item) => item !== id);
    setSelectedSpecs(updated);
    setValue("specializationIds", updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setValue("thumbnail", selectedFile);
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
    setValue("thumbnail", undefined);
  };

  const onSubmit = async (data: CourseFormData) => {
    // ✅ Validate thủ công
    if (!data.title || data.title.trim().length < 3) {
      toast.error("Tên khóa học phải có ít nhất 3 ký tự");
      return;
    }
    if (!data.description || data.description.trim().length < 10) {
      toast.error("Mô tả phải có ít nhất 10 ký tự");
      return;
    }
    if (!selectedSpecs.length) {
      toast.error("Vui lòng chọn ít nhất một chuyên ngành!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", courseType);
      formData.append("isPublished", selectPublic);
      formData.append(
        "price",
        courseType === "PAID" ? data.price?.toString() ?? "0" : "0"
      );

      selectedSpecs.forEach((id) =>
        formData.append("specializationIds", id.toString())
      );

      if (file) formData.append("thumbnail", file);

      await dispatch(
        updateCourse({ id: course.id, payload: formData })
      ).unwrap();
      await dispatch(fetchCoursesByInstructor()).unwrap();

      toast.success("Cập nhật khóa học thành công!");
      setOpen(false);
    } catch {
      toast.error("Không thể cập nhật khóa học!");
    }
  };

  if (specializationLoading) return <LoadingScreen />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="w-4 h-4" />
          Sửa
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Cập nhật khóa học
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4"
          encType="multipart/form-data"
        >
          {/* ─── Tên khóa học ───────────────────── */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Tên khóa học</label>
            <Input placeholder="Nhập tên khóa học" {...register("title")} />
          </div>

          {/* ─── Loại khóa học ───────────────────── */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Loại khóa học</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="FREE"
                  checked={courseType === "FREE"}
                  onChange={() => {
                    setCourseType("FREE");
                    setValue("type", "FREE");
                    setValue("price", 0);
                  }}
                />
                Miễn phí
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="PAID"
                  checked={courseType === "PAID"}
                  onChange={() => {
                    setCourseType("PAID");
                    setValue("type", "PAID");
                  }}
                />
                Trả phí
              </label>
            </div>
          </div>

          {/* ─── Giá ───────────────────────────── */}
          {courseType === "PAID" && (
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Giá (VNĐ)</label>
              <Input
                type="number"
                placeholder="Nhập giá khóa học"
                {...register("price", { valueAsNumber: true })}
              />
            </div>
          )}

          {/* ─── Trạng thái ───────────────────────────── */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Trạng thái khóa học</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={selectPublic === "true"}
                  onChange={() => setSelectPublic("true")}
                />
                Công khai
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={selectPublic === "false"}
                  onChange={() => setSelectPublic("false")}
                />
                Bản nháp
              </label>
            </div>
          </div>

          {/* ─── Chuyên ngành ───────────────────────────── */}
          <div className="flex flex-col gap-2 relative">
            <label className="font-medium text-sm">Chuyên ngành</label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex justify-between items-center border rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none"
            >
              {selectedSpecs.length > 0
                ? `${selectedSpecs.length} chuyên ngành đã chọn`
                : "Chọn chuyên ngành"}
              <ChevronDown className="w-4 h-4 opacity-60" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-10 z-50 my-10 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-auto">
                {instructorSpecializaions.length === 0 ? (
                  <p className="text-sm text-gray-500 p-3 text-center">
                    Không có chuyên ngành
                  </p>
                ) : (
                  instructorSpecializaions.map((spec) => (
                    <div
                      key={spec.id}
                      onClick={() => toggleSelect(spec.id)}
                      className="flex justify-between items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    >
                      <span>{spec.name}</span>
                      {selectedSpecs.includes(spec.id) && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSpecs.map((id) => {
                  const spec = instructorSpecializaions.find(
                    (s) => s.id === id
                  );
                  return (
                    <span
                      key={id}
                      className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {spec?.name}
                      <button
                        type="button"
                        onClick={() => removeSpec(id)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── Mô tả ───────────────────────────── */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Mô tả</label>
            <RichTextEditor
              value={watch("description") || ""}
              onChange={(val) => setValue("description", val)}
            />
          </div>

          {/* ─── Ảnh khóa học ───────────────────────────── */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Ảnh khóa học</label>
            {!preview ? (
              <label
                htmlFor="thumbnail"
                className="flex flex-col items-center justify-center border border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50"
              >
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Chọn ảnh từ thiết bị
                </span>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removePreview}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
