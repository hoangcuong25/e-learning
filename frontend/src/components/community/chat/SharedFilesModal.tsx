"use client";

import {
  X,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Download,
} from "lucide-react";
import Image from "next/image";

interface SharedFilesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: any[];
}

export default function SharedFilesModal({
  open,
  onOpenChange,
  messages,
}: SharedFilesModalProps) {
  if (!open) return null;

  // Extract all media from messages
  const allMedia = messages.reduce((acc: any[], msg: any) => {
    if (msg.media && msg.media.length > 0) {
      return [
        ...acc,
        ...msg.media.map((m: any) => ({ ...m, createdAt: msg.createdAt })),
      ];
    }
    return acc;
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="text-blue-600" size={24} />
              Tệp đã chia sẻ
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tổng cộng {allMedia.length} tệp phương tiện
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {allMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ImageIcon size={32} />
              </div>
              <p>Chưa có tệp phương tiện nào được chia sẻ</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allMedia.map((item: any, index: number) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={item.url}
                      alt="Shared media"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <Video size={32} />
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => window.open(item.url, "_blank")}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
                      title="Xem chi tiết"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <a
                      href={item.url}
                      download
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
                      title="Tải xuống"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
