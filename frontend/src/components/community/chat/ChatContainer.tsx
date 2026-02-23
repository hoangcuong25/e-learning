"use client";

import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatContainer() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-[700px] flex animate-in fade-in zoom-in-95 duration-300">
      <div className="w-1/3 min-w-[280px]">
        <ChatList />
      </div>
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}
