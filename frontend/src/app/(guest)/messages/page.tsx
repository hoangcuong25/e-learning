import ChatContainer from "@/components/community/chat/ChatContainer";

export default function MessagesPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full h-[85vh]">
         <ChatContainer />
      </div>
    </div>
  );
}
