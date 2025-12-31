import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAllAsReadApi,
  markAsReadApi,
  deleteNotificationApi,
  FindNotificationsParams,
} from "@/store/api/notifications.api";

// 🧱 Types (Bạn có thể tách ra file types riêng nếu cần)
export interface NotificationType {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: number;
  // thêm các field khác tùy vào model Prisma của bạn
}

// 🧱 State
interface NotificationState {
  notifications: NotificationType[];
  unreadCount: number;
  meta: {
    total: number;
    page: number;
    lastPage: number;
  } | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  meta: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy danh sách thông báo
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params: FindNotificationsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await getNotificationsApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tải thông báo");
    }
  }
);

// 🔢 Lấy số lượng chưa đọc
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnreadCountApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi tải số lượng chưa đọc"
      );
    }
  }
);

// ✅ Đánh dấu tất cả đã đọc
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllAsReadApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi đánh dấu đã đọc");
    }
  }
);

// ✅ Đánh dấu 1 cái đã đọc
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await markAsReadApi(id);
      return { ...response, id }; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi xử lý thông báo");
    }
  }
);

// 🗑️ Xóa thông báo
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteNotificationApi(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi xóa thông báo");
    }
  }
);

// 🧩 Slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    // Có thể thêm reducer để nhận socket event push notification realtime
    addNewNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch All
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data.data || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Lỗi tải danh sách thông báo";
      })

      // 🔢 Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        // Giả sử API trả về trực tiếp số hoặc { data: number }
        state.unreadCount =
          typeof action.payload === "number"
            ? action.payload
            : action.payload.data.unreadCount;
      })

      // ✅ Mark All Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
      })

      // ✅ Mark One Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.meta.arg; // Lấy ID từ tham số truyền vào
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // 🗑️ Delete
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Đã xóa thông báo";

        const deletedId = action.meta.arg;
        const notification = state.notifications.find(
          (n) => n.id === deletedId
        );

        // Nếu xóa tin chưa đọc thì giảm count
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        state.notifications = state.notifications.filter(
          (n) => n.id !== deletedId
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Lỗi khi xóa thông báo";
      });
  },
});

export const { clearNotificationState, addNewNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
