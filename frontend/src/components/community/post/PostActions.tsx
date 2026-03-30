"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { updatePostVisibility } from "@/store/slice/community/postSlice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Flag,
  Copy,
  Trash2,
  Edit,
  Lock,
  Globe,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { ReportTargetType } from "@/constants/report.enum";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface PostActionsProps {
  post: any;
  currentUser: any;
  onEdit: (post: any) => void;
  onDelete: (post: any) => void;
}

export default function PostActions({
  post,
  currentUser,
  onEdit,
  onDelete,
}: PostActionsProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isOwner = currentUser?.id === post.authorId;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);

  const handleVisibilityChange = async (visibility: string) => {
    try {
      await dispatch(
        updatePostVisibility({ id: post.id, visibility })
      ).unwrap();
      toast.success("Đã cập nhật quyền riêng tư");
    } catch (error) {
      toast.error("Không thể cập nhật quyền riêng tư");
    }
  };

  const visibilityOptions = [
    { value: "PUBLIC", label: "Công khai", icon: Globe },
    { value: "FOLLOWERS", label: "Người theo dõi", icon: Users },
    { value: "PRIVATE", label: "Riêng tư", icon: Lock },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all outline-none">
            <MoreHorizontal size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl shadow-2xl"
        >
          {isOwner && (
            <>
              <DropdownMenuItem
                onClick={() => onEdit(post)}
                className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-lg mx-1 my-0.5"
              >
                <Edit className="mr-2 h-4 w-4 text-indigo-400" />
                <span>Chỉnh sửa</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 rounded-lg mx-1 my-0.5">
                  <Lock className="mr-2 h-4 w-4 text-slate-400" />
                  <span>Quyền riêng tư</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
                  {visibilityOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleVisibilityChange(option.value)}
                        className={`cursor-pointer rounded-lg mx-1 my-0.5 ${
                          post.visibility === option.value
                            ? "bg-indigo-600/20 text-indigo-400 font-bold"
                            : "text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                        }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{option.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10 rounded-lg mx-1 my-0.5"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Xóa bài viết</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/community/post/${post.id}`
              );
              toast.success("Đã sao chép liên kết");
            }}
            className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-lg mx-1 my-0.5"
          >
            <Copy className="mr-2 h-4 w-4 text-slate-400" />
            <span>Sao chép liên kết</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenReportDialog(true)}
            className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-lg mx-1 my-0.5"
          >
            <Flag className="mr-2 h-4 w-4 text-amber-400" />
            <span>Báo cáo bài viết</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-100 tracking-tight mb-1">
                  Xóa bài viết?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Bạn có chắc chắn muốn xóa bài viết này không? Hành động này
                  không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2.5 text-sm font-black text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl uppercase tracking-widest transition-all"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onDelete(post);
                  setShowDeleteDialog(false);
                }}
                className="px-4 py-2.5 text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                autoFocus
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Dialog */}
      <ReportDialog
        open={openReportDialog}
        onOpenChange={setOpenReportDialog}
        targetType={ReportTargetType.POST}
        targetId={post.id}
      />
    </>
  );
}
