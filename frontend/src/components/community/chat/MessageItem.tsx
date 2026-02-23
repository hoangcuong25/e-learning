"use client";

import dayjs from "dayjs";

interface MessageItemProps {
  message: any;
  isMe: boolean;
  isAi?: boolean;
  timeString?: string;
}

export default function MessageItem({
  message,
  isMe,
  isAi,
  timeString,
}: MessageItemProps) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex flex-col ${
          isMe ? "items-end" : "items-start"
        } max-w-[80%]`}
      >
        <div
          className={`
            px-4 py-2 rounded-2xl text-sm
            ${
              isMe
                ? "bg-blue-600 text-white rounded-tr-none"
                : isAi
                ? "bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800 rounded-tl-none border border-purple-100 shadow-sm"
                : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
            }
          `}
        >
          {isAi && (
            <div className="flex items-center gap-1 mb-1 font-bold text-[10px] text-purple-600 uppercase tracking-wider">
              <span>AI EduSmart</span>
            </div>
          )}

          {message.content && (
            <p className="mb-1 whitespace-pre-wrap">{message.content}</p>
          )}

          {isAi && message.metadata && (
            <div className="mt-2 space-y-2 text-xs border-t border-purple-100 pt-2">
              {message.metadata.example && (
                <div>
                  <span className="font-semibold text-purple-700">Ví dụ: </span>
                  <span className="italic text-gray-600">
                    {message.metadata.example}
                  </span>
                </div>
              )}
              {message.metadata.note && (
                <div className="bg-amber-50 p-2 rounded border border-amber-100 text-amber-800">
                  <span className="font-semibold">Lưu ý: </span>
                  {message.metadata.note}
                </div>
              )}
            </div>
          )}

          {message.media && message.media.length > 0 && (
            <div className={`mt-2 flex flex-col gap-2`}>
              {message.media.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-white"
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={item.url}
                      alt="Attached"
                      className="max-w-full h-auto object-contain cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() => window.open(item.url, "_blank")}
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="max-w-full h-auto object-contain max-h-[300px]"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {timeString && (
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {timeString}
          </span>
        )}
      </div>
    </div>
  );
}
