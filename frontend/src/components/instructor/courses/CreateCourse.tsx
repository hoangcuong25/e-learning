"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ImageIcon, X, ChevronDown, Check, BookOpen, DollarSign } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  createCourse,
  fetchCoursesByInstructor,
} from "@/store/slice/course/coursesSlice";
import { CourseFormData, courseSchema } from "@/hook/zod-schema/CourseSchema";
import LoadingScreen from "@/components/LoadingScreen";
import RichTextEditor from "@/components/RichTextEditor";

export default function CourseCreate() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );
  const { instructorSpecializaions, loading: specializationLoading } =
    useSelector((state: RootState) => state.specialization);

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>([]);
  const [courseType, setCourseType] = useState<"FREE" | "PAID">("FREE");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      type: "FREE",
    },
  });

  // 🧩 Toggle chuyên ngành
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

  // 🖼️ Chọn ảnh
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

  // 🚀 Submit
  const onSubmit = async (data: CourseFormData) => {
    if (!selectedSpecs.length) {
      toast.error("Vui lòng chọn ít nhất một chuyên ngành!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", courseType);
      formData.append("instructorId", user?.id.toString() ?? "");

      if (courseType === "PAID" && data.price)
        formData.append("price", data.price.toString());
      else formData.append("price", "0");

      selectedSpecs.forEach((id) =>
        formData.append("specializationIds", id.toString()),
      );

      if (file) formData.append("thumbnail", file);

      await dispatch(createCourse(formData)).unwrap();
      await dispatch(fetchCoursesByInstructor()).unwrap();

      toast.success("Tạo khóa học thành công!");
      reset();
      removePreview();
      setSelectedSpecs([]);
      setCourseType("FREE");
      setOpen(false);
    } catch {
      toast.error("Không thể tạo khóa học!");
    }
  };

  if (userLoading || specializationLoading) return <LoadingScreen />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl px-6 py-6 shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5 shadow-sm" />
          Tạo khóa học mới
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[850px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0">
        <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <BookOpen className="w-5 h-5 text-white" />
             </div>
             Tạo Khóa Học Mới
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-8"
          encType="multipart/form-data"
        >
          {/* 🚀 Grid Layout for better space usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* ─── Tên khóa học ───────────────────── */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tên khóa học chính thức</label>
                <Input
                  placeholder="Ví dụ: Lập trình ReactJS từ cơ bản đến nâng cao"
                  {...register("title")}
                  className={`h-12 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-2xl transition-all font-medium ${errors.title ? "border-red-500 bg-red-50/30" : ""}`}
                />
                {errors.title && (
                  <p className="text-xs font-bold text-red-500 mt-1 ml-1 leading-none">{errors.title.message}</p>
                )}
              </div>

              {/* ─── Loại khóa học & Giá ───────────────────── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mô hình học</label>
                  <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 h-12">
                    <button
                      type="button"
                      onClick={() => { setCourseType("FREE"); setValue("type", "FREE"); setValue("price", 0); }}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${courseType === "FREE" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Miễn phí
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCourseType("PAID"); setValue("type", "PAID"); }}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${courseType === "PAID" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Trả phí
                    </button>
                  </div>
                </div>

                {courseType === "PAID" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <label className="text-sm font-bold text-slate-700 ml-1">Giá (Coin)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <Input
                        type="number"
                        placeholder="0"
                        {...register("price", { valueAsNumber: true })}
                        className={`pl-10 h-12 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-2xl transition-all font-black text-indigo-600 ${errors.price ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Chuyên ngành ───────────────────────────── */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Chuyên ngành liên quan</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex justify-between items-center h-12 px-4 bg-slate-50 border-transparent hover:bg-slate-100/80 rounded-2xl transition-all text-sm font-medium text-slate-600"
                  >
                    {selectedSpecs.length > 0
                      ? `Đã chọn ${selectedSpecs.length} chuyên ngành`
                      : "Duyệt danh mục chuyên ngành"}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-[60] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 max-h-52 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                      {instructorSpecializaions.length === 0 ? (
                        <p className="text-xs font-bold text-slate-400 p-4 text-center">Không tìm thấy chuyên ngành nào</p>
                      ) : (
                        instructorSpecializaions.map((spec) => (
                          <div
                            key={spec.id}
                            onClick={() => toggleSelect(spec.id)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors mb-1 last:mb-0 ${selectedSpecs.includes(spec.id) ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50 text-slate-600"}`}
                          >
                            <span className="text-xs font-bold">{spec.name}</span>
                            {selectedSpecs.includes(spec.id) && <Check className="w-4 h-4" />}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {selectedSpecs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-50 min-h-[44px]">
                    {selectedSpecs.map((id) => {
                      const spec = instructorSpecializaions.find((s) => s.id === id);
                      return (
                        <Badge
                          key={id}
                          className="pl-3 pr-1 py-1 bg-white text-indigo-600 border border-indigo-100 rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="text-[10px] font-black uppercase tracking-tight">{spec?.name}</span>
                          <button type="button" onClick={() => removeSpec(id)} className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ─── Right Column: Media ───────────────────── */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Ảnh bìa khóa học</label>
                {!preview ? (
                  <label
                    htmlFor="thumbnail"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] h-[200px] cursor-pointer hover:bg-indigo-50/30 hover:border-indigo-200 transition-all group"
                  >
                    <div className="p-4 bg-slate-50 group-hover:bg-indigo-100 rounded-2xl transition-colors">
                       <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4 group-hover:text-indigo-600">Chọn ảnh từ máy</span>
                    <Input id="thumbnail" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-[200px] rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-inner group">
                    <Image src={preview} alt="Preview" fill className="object-cover transition-transform group-hover:scale-105 duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button
                        type="button"
                        onClick={removePreview}
                        className="bg-white/90 backdrop-blur-md text-red-600 p-3 rounded-2xl shadow-xl hover:bg-white hover:scale-110 active:scale-90 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 font-medium italic text-center leading-relaxed">Khuyến nghị tỷ lệ 16:9, dung lượng nhỏ hơn 5MB.</p>
              </div>

              {/* Quick Info Box */}
              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-[2rem]">
                 <CardTitle className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">Lưu ý quan trọng</CardTitle>
                 <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                    Tất cả khóa học mới mặc định ở trạng thái <strong>Bản nháp</strong>. 
                    Bạn cần tạo ít nhất một chương và bài học trước khi công khai ra cộng đồng.
                 </p>
              </div>
            </div>
          </div>

          {/* ─── Nội dung khóa học ───────────────────────────── */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Mô tả chi tiết nội dung chương trình</label>
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm focus-within:border-indigo-100 transition-colors">
              <RichTextEditor
                value={watch("description") || ""}
                onChange={(val) => setValue("description", val)}
              />
            </div>
            {errors.description && (
              <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-6 border-t border-slate-50 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600 font-black uppercase tracking-tight hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Bắt đầu tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
