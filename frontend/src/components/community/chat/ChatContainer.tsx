"use client";

import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatContainer() {
  return (
    <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden h-full flex animate-in fade-in zoom-in-95 duration-500 relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-[320px] md:w-[380px] flex-shrink-0 relative z-10 border-r border-slate-50">
        <ChatList />
      </div>
      <div className="flex-1 relative z-10 bg-slate-50/20">
        <ChatWindow />
      </div>
    </div>
  );
}
