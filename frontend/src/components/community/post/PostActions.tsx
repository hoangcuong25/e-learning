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
          <button className="text-gray-400 hover:text-gray-600 outline-none">
            <MoreHorizontal size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isOwner && (
            <>
              <DropdownMenuItem
                onClick={() => onEdit(post)}
                className="cursor-pointer text-gray-700 focus:bg-gray-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Chỉnh sửa</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Quyền riêng tư</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {visibilityOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleVisibilityChange(option.value)}
                        className={`cursor-pointer ${
                          post.visibility === option.value
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : ""
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
                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
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
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Sao chép liên kết</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenReportDialog(true)}
            className="cursor-pointer text-gray-700 focus:bg-gray-50"
          >
            <Flag className="mr-2 h-4 w-4" />
            <span>Báo cáo bài viết</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xóa bài viết?
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onDelete(post);
                  setShowDeleteDialog(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                autoFocus
              >
                Xóa
              </button>
            </div>
          </div>
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
