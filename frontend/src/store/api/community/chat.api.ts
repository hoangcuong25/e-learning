import axiosClient from "@/lib/axiosClient";

export interface CreateMessagePayload {
  receiverId?: number;
  content: string;
  messageType?: "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "AI" | "TERM_EXPLANATION";
  media?: { url: string; type: "IMAGE" | "VIDEO" }[];
  isAiResponse?: boolean;
  metadata?: any;
}

export interface ConversationQuery {
  page?: number;
  limit?: number;
}

export interface MessageQuery {
  page?: number;
  limit?: number;
}

// 🧩 1. Gửi tin nhắn
export const sendMessageApi = async (payload: CreateMessagePayload) => {
  const response = await axiosClient.post("/community/chat/messages", payload);
  return response.data;
};

// 🧩 2. Lấy danh sách hội thoại
export const getConversationsApi = async (params?: ConversationQuery) => {
  const response = await axiosClient.get("/community/chat/conversations", {
    params,
  });
  return response.data;
};

// 🧩 3. Lấy tin nhắn của một hội thoại
export const getMessagesApi = async (id: number, params?: MessageQuery) => {
  const response = await axiosClient.get(
    `/community/chat/conversations/${id}/messages`,
    { params }
  );
  return response.data;
};

// 🧩 4. Đánh dấu hội thoại là đã đọc
export const markAsReadApi = async (id: number) => {
  const response = await axiosClient.patch(
    `/community/chat/conversations/${id}/read`
  );
  return response.data;
};

// 🧩 5. Ẩn/Xóa hội thoại
export const hideConversationApi = async (id: number) => {
  const response = await axiosClient.delete(
    `/community/chat/conversations/${id}`
  );
  return response.data;
};

// 🧩 6. Tìm hoặc tạo hội thoại
export const findOrCreateUserConversationApi = async (targetUserId: number) => {
  const response = await axiosClient.post(
    "/community/chat/conversations/find-or-create",
    { targetUserId }
  );
  return response.data;
};

// 🧩 7. Lấy hội thoại với AI
export const getAiConversationApi = async () => {
  const response = await axiosClient.get("/community/chat/conversations/ai");
  return response.data;
};

// 🧩 8. Chat với AI
export const chatWithAiApi = async (payload: CreateMessagePayload) => {
  const response = await axiosClient.post(
    "/community/chat/messages/ai",
    payload
  );
  return response.data;
};
