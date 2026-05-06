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
import { ImageIcon, X, ChevronDown, Check, Pencil } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  updateCourse,
  fetchCoursesByInstructor,
} from "@/store/slice/course/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import RichTextEditor from "@/components/RichTextEditor";

import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { BookOpen, DollarSign } from "lucide-react";

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
    course.thumbnail || null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>(
    course.specializations?.map((s: any) => s.specializationId) || [],
  );
  const [courseType, setCourseType] = useState<"FREE" | "PAID">(
    course.type || "FREE",
  );
  const [selectPublic, setSelectPublic] = useState(
    (course.isPublished || false).toString(),
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
        courseType === "PAID" ? (data.price?.toString() ?? "0") : "0",
      );

      selectedSpecs.forEach((id) =>
        formData.append("specializationIds", id.toString()),
      );

      if (file) formData.append("thumbnail", file);

      await dispatch(
        updateCourse({ id: course.id, payload: formData }),
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
        <Button variant="outline" className="flex items-center gap-2 h-12 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all hover:border-indigo-200 hover:text-indigo-600 group">
          <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Thiết lập
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[850px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0">
        <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
             <div className="p-2.5 bg-amber-500 rounded-xl shadow-lg shadow-amber-200">
                <Pencil className="w-5 h-5 text-white" />
             </div>
             Cập Nhật Khóa Học
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
                <label className="text-sm font-bold text-slate-700 ml-1">Tên khóa học</label>
                <Input
                  placeholder="Nhập tên khóa học"
                  {...register("title")}
                  className="h-12 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-2xl transition-all font-medium"
                />
              </div>

               {/* ─── Visibility & Type Row ───────────────────── */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Trạng thái</label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 h-12">
                      <button
                        type="button"
                        onClick={() => setSelectPublic("true")}
                        className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${selectPublic === "true" ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        Công khai
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectPublic("false")}
                        className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${selectPublic === "false" ? "bg-slate-700 text-white shadow-md shadow-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        Bản nháp
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Mô hình học</label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 h-12">
                      <button
                        type="button"
                        onClick={() => { setCourseType("FREE"); setValue("type", "FREE"); setValue("price", 0); }}
                        className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${courseType === "FREE" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        Miễn phí
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCourseType("PAID"); setValue("type", "PAID"); }}
                        className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${courseType === "PAID" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        Trả phí
                      </button>
                    </div>
                  </div>
               </div>

              {/* ─── Giá ───────────────────────────── */}
              {courseType === "PAID" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 ml-1">Giá điều chỉnh (Coin)</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <Input
                      type="number"
                      placeholder="0"
                      {...register("price", { valueAsNumber: true })}
                      className="pl-10 h-12 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-2xl transition-all font-black text-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* ─── Chuyên ngành ───────────────────────────── */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Danh mục chuyên ngành</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex justify-between items-center h-12 px-4 bg-slate-50 border-transparent hover:bg-slate-100/80 rounded-2xl transition-all text-sm font-medium text-slate-600"
                  >
                    {selectedSpecs.length > 0
                      ? `Đã chọn ${selectedSpecs.length} danh mục`
                      : "Thay đổi chuyên ngành"}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-[60] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 max-h-52 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                      {instructorSpecializaions.length === 0 ? (
                        <p className="text-xs font-bold text-slate-400 p-4 text-center">Trống</p>
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
                <label className="text-sm font-bold text-slate-700 ml-1">Ảnh đại diện khóa học</label>
                {!preview ? (
                  <label
                    htmlFor="thumbnail-upd"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] h-[200px] cursor-pointer hover:bg-slate-50 transition-all group"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-indigo-400" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4">Tải ảnh mới</span>
                    <Input id="thumbnail-upd" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
              </div>

               {/* Quick Info Box */}
               <div className="p-5 bg-amber-50 border border-amber-100 rounded-[2rem]">
                 <CardTitle className="text-xs font-black text-amber-900 uppercase tracking-widest mb-2">Thông tin cập nhật</CardTitle>
                 <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    Mọi thay đổi về giá hoặc nội dung sẽ có hiệu lực ngay lập tức. 
                    Hãy kiểm tra kỹ trước khi nhấn <strong>Lưu thay đổi</strong>.
                 </p>
              </div>
            </div>
          </div>

          {/* ─── Mô tả ───────────────────────────── */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Mô tả chương trình học</label>
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm focus-within:border-indigo-100 transition-colors">
              <RichTextEditor
                value={watch("description") || ""}
                onChange={(val) => setValue("description", val)}
              />
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-slate-50 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600 font-black uppercase tracking-tight hover:bg-slate-50 transition-all"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
