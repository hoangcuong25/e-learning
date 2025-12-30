import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getCartApi,
  addCourseToCartApi,
  removeCourseFromCartApi,
  clearCartApi,
} from "@/api/cart.api";

interface CartState {
  items: CartItemType[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null,
};

//  1. Lấy giỏ hàng
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const response = await getCartApi();
  return response.data; // từ backend trả về { data: {...} }
});

//  2. Thêm khóa học vào giỏ hàng
export const addToCart = createAsyncThunk(
  "cart/add",
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await addCourseToCartApi(courseId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi thêm khóa học");
    }
  }
);

//  3. Xóa 1 khóa học
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await removeCourseFromCartApi(courseId);
      return { ...response, courseId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi xóa khóa học");
    }
  }
);

//  4. Xóa toàn bộ giỏ hàng
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearCartApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi xóa toàn bộ giỏ");
    }
  }
);

// 🧩 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Lấy giỏ hàng
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tải giỏ hàng";
      })

      // ➕ Thêm khóa học
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Đã thêm khóa học";
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ❌ Xóa khóa học
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Đã xóa khóa học";
        const courseId = action.payload.courseId;
        state.items = state.items.filter((item) => item.courseId !== courseId);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🧹 Xóa toàn bộ giỏ hàng
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Đã xóa toàn bộ giỏ";
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
