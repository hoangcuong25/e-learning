import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  sendMessageApi,
  getConversationsApi,
  getMessagesApi,
  markAsReadApi,
  hideConversationApi,
  findOrCreateUserConversationApi,
  getAiConversationApi,
  chatWithAiApi,
  CreateMessagePayload,
  ConversationQuery,
  MessageQuery,
} from "@/store/api/community/chat.api";

interface ChatState {
  conversations: any[]; // ConversationType[]
  messages: any[]; // MessageType[]
  currentConversation: any | null; // ConversationType | null
  pagination: {
    total?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
  } | null;
  loading: boolean;
  sending: boolean;
  typingUsers: Record<number, string[]>; // conversationId -> userEmails[]
  error: string | null;
  successMessage: string | null;
  isMiniChatOpen: boolean;
}

const VIRTUAL_AI_USER = {
  id: "ai",
  fullname: "AI smart",
  avatar:
    "http://res.cloudinary.com/dzfansbci/image/upload/v1765893235/uploads/xk5rhjsojlmicveb80kn.jpg",
  email: "ai@smart.edu",
};

const initialState: ChatState = {
  conversations: [],
  messages: [],
  currentConversation: null,
  pagination: null,
  loading: false,
  sending: false,
  typingUsers: {},
  error: null,
  successMessage: null,
  isMiniChatOpen: false,
};

// 🧾 Lấy danh sách hội thoại
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (params: ConversationQuery, { rejectWithValue }) => {
    try {
      const response = await getConversationsApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi tải danh sách hội thoại"
      );
    }
  }
);

// 📖 Lấy tin nhắn trong hội thoại
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (data: { id: number; params?: MessageQuery }, { rejectWithValue }) => {
    try {
      const response = await getMessagesApi(data.id, data.params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tải tin nhắn");
    }
  }
);

// 📤 Gửi tin nhắn
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (payload: CreateMessagePayload, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi gửi tin nhắn");
    }
  }
);

// ✅ Đánh dấu đã đọc
export const markConversationAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await markAsReadApi(id);
      return { id, data: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi đánh dấu đã đọc");
    }
  }
);

// 🗑️ Ẩn hội thoại
export const hideConversation = createAsyncThunk(
  "chat/hideConversation",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await hideConversationApi(id);
      return { id, data: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi ẩn hội thoại");
    }
  }
);

// 🔍 Tìm hoặc Tạo hội thoại
export const findOrCreateConversation = createAsyncThunk(
  "chat/findOrCreateConversation",
  async (targetUserId: number, { rejectWithValue }) => {
    try {
      const response = await findOrCreateUserConversationApi(targetUserId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi tìm hoặc tạo hội thoại"
      );
    }
  }
);

// 🤖 Lấy hội thoại với AI
export const getAiConversation = createAsyncThunk(
  "chat/getAiConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAiConversationApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy hội thoại với AI"
      );
    }
  }
);

export const chatWithAi = createAsyncThunk(
  "chat/chatWithAi",
  async (payload: CreateMessagePayload, { rejectWithValue }) => {
    try {
      const response = await chatWithAiApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi chat với AI");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setMiniChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isMiniChatOpen = action.payload;
    },
    receiveNewMessage: (state, action: PayloadAction<any>) => {
      const { message: newMessage, currentUserId } = action.payload;
      const isCurrentConv =
        state.currentConversation &&
        state.currentConversation.id === newMessage.conversationId;

      if (isCurrentConv) {
        // Tránh trùng lặp tin nhắn
        const exists = state.messages.find((m) => m.id === newMessage.id);
        if (!exists) {
          state.messages.push(newMessage);
        }
      }

      const convIndex = state.conversations.findIndex(
        (c) => c.id === newMessage.conversationId
      );
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = newMessage;
        state.conversations[convIndex].updatedAt = newMessage.createdAt;

        // Tăng unreadCount nếu (tin nhắn đến từ người khác) và (không đang mở hội thoại này)
        if (!isCurrentConv && newMessage.senderId !== currentUserId) {
          state.conversations[convIndex].unreadCount =
            (state.conversations[convIndex].unreadCount || 0) + 1;
        }

        const conv = state.conversations.splice(convIndex, 1)[0];
        state.conversations.unshift(conv);
      }
    },
    addNewConversation: (state, action: PayloadAction<any>) => {
      const exists = state.conversations.find(
        (c) => c.id === action.payload.id
      );
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    setTypingStatus: (
      state,
      action: PayloadAction<{
        conversationId: number;
        email: string;
        isTyping: boolean;
      }>
    ) => {
      const { conversationId, email, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }

      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(email)) {
          state.typingUsers[conversationId].push(email);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((e) => e !== email);
      }
    },
    addLocalMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data.data || [];
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data.data || [];
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const newMessage = action.payload.data;
        state.messages.push(newMessage);
        const convId = newMessage.conversationId;
        const convIndex = state.conversations.findIndex((c) => c.id === convId);
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = newMessage;
          const conv = state.conversations.splice(convIndex, 1)[0];
          state.conversations.unshift(conv);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload as string;
      })

      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const { id } = action.payload;
        const convIndex = state.conversations.findIndex((c) => c.id === id);
        if (convIndex !== -1) {
          state.conversations[convIndex].unreadCount = 0;
        }
        if (state.currentConversation?.id === id) {
          state.currentConversation.unreadCount = 0;
          // Mark all current messages as read
          state.messages = state.messages.map((m) => ({ ...m, isRead: true }));
        }
      })

      .addCase(hideConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (c) => c.id !== action.payload.id
        );
        if (state.currentConversation?.id === action.payload.id) {
          state.currentConversation = null;
          state.messages = [];
        }
      })

      .addCase(findOrCreateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findOrCreateConversation.fulfilled, (state, action) => {
        state.loading = false;
        const { conversation } = action.payload.data;
        state.currentConversation = conversation;
        const exists = state.conversations.find(
          (c) => c.id === conversation.id
        );
        if (!exists) {
          state.conversations.unshift(conversation);
        }
      })
      .addCase(findOrCreateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getAiConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAiConversation.fulfilled, (state, action) => {
        state.loading = false;
        const { conversation } = action.payload.data;
        state.currentConversation = conversation;
      })
      .addCase(getAiConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(chatWithAi.pending, (state) => {
        state.sending = true;
      })
      .addCase(chatWithAi.fulfilled, (state, action) => {
        state.sending = false;
        const aiMessage = action.payload.data;
        state.messages.push(aiMessage);
        if (
          state.currentConversation &&
          state.currentConversation.id === aiMessage.conversationId
        ) {
          state.currentConversation.lastMessage = aiMessage.content;
          state.currentConversation.lastMessageAt = aiMessage.createdAt;
        }
      })
      .addCase(chatWithAi.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearChatState,
  setCurrentConversation,
  setMiniChatOpen,
  receiveNewMessage,
  addNewConversation,
  setTypingStatus,
  addLocalMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
