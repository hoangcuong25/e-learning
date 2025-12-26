import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllDiscountsApi,
  getDiscountByIdApi,
  createDiscountApi,
  updateDiscountApi,
  deleteDiscountApi,
  toggleDiscountStatusApi,
} from "@/api/discount.api";

// 🧩 Interface State
interface DiscountCampaign {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  [key: string]: any;
}

interface DiscountState {
  discounts: DiscountCampaign[];
  currentDiscount: DiscountCampaign | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: DiscountState = {
  discounts: [],
  currentDiscount: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả discount campaigns
export const fetchAllDiscounts = createAsyncThunk(
  "discount/fetchAll",
  async (params?: any) => {
    const response = await getAllDiscountsApi(params);
    return response.data;
  }
);

// 🔍 Lấy chi tiết discount
export const fetchDiscountById = createAsyncThunk(
  "discount/fetchById",
  async (id: number) => {
    const response = await getDiscountByIdApi(id);
    return response.data;
  }
);

// ➕ Tạo mới
export const createDiscount = createAsyncThunk(
  "discount/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createDiscountApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tạo discount");
    }
  }
);

// ✏️ Cập nhật
export const updateDiscount = createAsyncThunk(
  "discount/update",
  async (data: { id: number; payload: any }) => {
    const response = await updateDiscountApi(data.id, data.payload);
    return response;
  }
);

// 🗑️ Xóa
export const deleteDiscount = createAsyncThunk(
  "discount/delete",
  async (id: number) => {
    const response = await deleteDiscountApi(id);
    return response;
  }
);

// 🔄 Toggle trạng thái
export const toggleDiscountStatus = createAsyncThunk(
  "discount/toggleStatus",
  async (id: number) => {
    const response = await toggleDiscountStatusApi(id);
    return response;
  }
);

// 🧩 Slice
const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    clearDiscountState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch all
      .addCase(fetchAllDiscounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload || [];
      })
      .addCase(fetchAllDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi tải discount campaigns";
      })

      // 🔍 Fetch by ID
      .addCase(fetchDiscountById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscountById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDiscount = action.payload;
      })
      .addCase(fetchDiscountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi tải chi tiết discount";
      })

      // ➕ Create
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Tạo discount thành công";
        state.discounts.push(action.payload.data);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Lỗi khi tạo discount campaign";
      })

      // ✏️ Update
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Cập nhật discount thành công";
        state.discounts = state.discounts.map((d) =>
          d.id === action.payload.data.id ? action.payload.data : d
        );
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi cập nhật discount";
      })

      // 🗑️ Delete
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Xóa discount thành công";
        const deletedId = action.meta.arg;
        state.discounts = state.discounts.filter((d) => d.id !== deletedId);
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi xóa discount";
      })

      // 🔄 Toggle status
      .addCase(toggleDiscountStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleDiscountStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Cập nhật trạng thái thành công";
        const updated = action.payload.data;
        state.discounts = state.discounts.map((d) =>
          d.id === updated.id ? updated : d
        );
      })
      .addCase(toggleDiscountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi toggle trạng thái";
      });
  },
});

export const { clearDiscountState } = discountSlice.actions;
export default discountSlice.reducer;
