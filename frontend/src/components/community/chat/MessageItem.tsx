import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Video } from "lucide-react";

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
    <motion.div 
      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-6 group`}
    >
      <div
        className={`flex flex-col ${
          isMe ? "items-end" : "items-start"
        } max-w-[85%] md:max-w-[70%]`}
      >
        {/* Bubble Stage */}
        <div
          className={`
            relative p-4 px-5 rounded-[1.8rem] text-sm leading-relaxed tracking-tight font-medium shadow-sm transition-all
            ${
              isMe
                ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10 hover:shadow-indigo-600/20"
                : isAi
                ? "bg-slate-900 text-white rounded-tl-none shadow-xl shadow-slate-900/10 border border-slate-800"
                : "bg-white text-slate-900 rounded-tl-none border border-slate-100 hover:border-slate-200"
            }
          `}
        >
          {/* AI Branding */}
          {isAi && (
            <div className="flex items-center gap-2 mb-3">
               <div className="w-5 h-5 bg-indigo-500 rounded-md flex items-center justify-center text-white">
                 <Sparkles size={12} fill="currentColor" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">AI Assistant</span>
            </div>
          )}

          {/* Content */}
          {message.content && (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* AI-specific Metadata */}
          {isAi && message.metadata && (
            <div className="mt-4 space-y-3 pt-3 border-t border-slate-800">
              {message.metadata.example && (
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                  <span className="block text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-1">Example Case</span>
                  <span className="italic text-slate-300 text-[13px]">
                    "{message.metadata.example}"
                  </span>
                </div>
              )}
              {message.metadata.note && (
                <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 text-amber-200 text-[12px]">
                   <span className="font-black uppercase tracking-widest text-[8px] block mb-1">Important Note</span>
                   {message.metadata.note}
                </div>
              )}
            </div>
          )}

          {/* Media Stage */}
          {message.media && message.media.length > 0 && (
            <div className={`mt-4 flex flex-col gap-3`}>
              {message.media.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-[1.5rem] overflow-hidden border border-slate-100/10 bg-black/20 relative group/media shadow-lg"
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={item.url}
                      alt="Attached media"
                      className="max-w-full h-auto object-contain cursor-pointer transition-all group-hover/media:opacity-90"
                      onClick={() => window.open(item.url, "_blank")}
                    />
                  ) : (
                    <div className="relative aspect-video bg-slate-900">
                       <video
                        src={item.url}
                        controls
                        className="w-full h-full object-contain"
                       />
                    </div>
                  )}
                  {/* Media Overlay label */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/40 backdrop-blur rounded-full text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/media:opacity-100 transition-opacity">
                     {item.type} Attachment
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp Stage */}
        <AnimatePresence>
          {timeString && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-1.5 mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {timeString}
              </span>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Sent</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
