import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllDiscountsApi,
  getDiscountByIdApi,
  createDiscountApi,
  updateDiscountApi,
  deleteDiscountApi,
  toggleDiscountStatusApi,
} from "@/store/api/common/discountCampaign.api";

// 🧩 Interface State

interface DiscountCampaignState {
  discounts: DiscountCampaignType[];
  currentDiscount: DiscountCampaignType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
}

const initialState: DiscountCampaignState = {
  discounts: [],
  currentDiscount: null,
  loading: false,
  error: null,
  successMessage: null,

  currentPage: 1,
  totalItems: 0,
  totalPages: 1,
  itemsPerPage: 10,
};

// 🧾 Lấy tất cả discount campaigns
export const fetchAllDiscounts = createAsyncThunk(
  "discount-campaign/fetchAll",
  async (params?: any) => {
    const response = await getAllDiscountsApi(params);
    return response.data;
  }
);

// 🔍 Lấy chi tiết discount
export const fetchDiscountById = createAsyncThunk(
  "discount-campaign/fetchById",
  async (id: number) => {
    const response = await getDiscountByIdApi(id);
    return response.data;
  }
);

// ➕ Tạo mới
export const createDiscount = createAsyncThunk(
  "discount-campaign/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createDiscountApi(payload);
      return response;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue(error.message || "Lỗi tạo discount");
    }
  }
);

// ✏️ Cập nhật
export const updateDiscount = createAsyncThunk(
  "discount-campaign/update",
  async (data: { id: number; payload: any }) => {
    const response = await updateDiscountApi(data.id, data.payload);
    return response;
  }
);

// 🗑️ Xóa
export const deleteDiscount = createAsyncThunk(
  "discount-campaign/delete",
  async (id: number) => {
    const response = await deleteDiscountApi(id);
    return response;
  }
);

// 🔄 Toggle trạng thái
export const toggleDiscountStatus = createAsyncThunk(
  "discount-campaign/toggleStatus",
  async (id: number) => {
    const response = await toggleDiscountStatusApi(id);
    return response;
  }
);

// 🧩 Slice
const discountCampaignSlice = createSlice({
  name: "discount-campaign",
  initialState,
  reducers: {
    clearDiscountCampaignState: (state) => {
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
        const apiResponse = action.payload;
        state.discounts = apiResponse.data || [];
        state.currentPage = apiResponse.pagination.currentPage || 1;
        state.totalItems = apiResponse.pagination.total || 0;
        state.itemsPerPage = apiResponse.pagination.pageSize || 10;
        state.totalPages = apiResponse.pagination.totalPages;
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
        state.discounts = action.payload.data || [];
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

export const { clearDiscountCampaignState } = discountCampaignSlice.actions;
export default discountCampaignSlice.reducer;
