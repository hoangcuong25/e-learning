"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { AppDispatch } from "@/store";
import { createReport } from "@/store/slice/common/reportSlice";
import {
  ReportReason,
  ReportReasonTranslation,
  ReportTargetType,
} from "@/constants/report.enum";
import { X, Loader2, ChevronDown, Check } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: keyof typeof ReportTargetType;
  targetId: number | string;
}

export function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
}: ReportDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState<string>(
    ReportReason.INAPPROPRIATE_CONTENT
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReport = async () => {
    if (!reportDescription.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createReport({
          targetType: targetType as any,
          targetId: Number(targetId),
          reason: reportType,
          description: reportDescription,
        })
      ).unwrap();
      toast.success("Gửi báo cáo thành công");
      onOpenChange(false);
      setReportDescription("");
      setReportType(ReportReason.INAPPROPRIATE_CONTENT);
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi gửi báo cáo");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Báo cáo</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Loại báo cáo
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <span className="truncate">
                  {ReportReasonTranslation[reportType as ReportReason]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                  {Object.values(ReportReason).map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => {
                        setReportType(reason);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                        reportType === reason
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {ReportReasonTranslation[reason]}
                      {reportType === reason && (
                        <Check className="w-4 h-4 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Mô tả chi tiết
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Mô tả vấn đề bạn gặp phải..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleReport}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi báo cáo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
