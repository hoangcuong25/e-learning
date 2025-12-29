import {
  applyCouponApi,
  createCouponApi,
  deleteCouponApi,
  getAllCouponsApi,
  getCouponByIdApi,
  getInstructorCouponsApi,
  updateCouponApi,
  createCouponDiscountByAdminApi,
  getCourseCouponsApi,
} from "@/api/coupon.api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface CouponState {
  coupons: any[];
  courseCoupons: any[];
  instructorCoupons: any[];
  currentCoupon: any | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CouponState = {
  coupons: [],
  courseCoupons: [],
  instructorCoupons: [],
  currentCoupon: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả coupon
export const fetchAllCoupons = createAsyncThunk(
  "coupon/fetchAll",
  async (params?: any) => {
    const response = await getAllCouponsApi(params);
    return response.data;
  }
);

// 🔍 Lấy chi tiết coupon theo ID
export const fetchCouponById = createAsyncThunk(
  "coupon/fetchById",
  async (id: number) => {
    const response = await getCouponByIdApi(id);
    return response.data;
  }
);

// ➕ Tạo coupon (Instructor)
export const createCoupon = createAsyncThunk(
  "coupon/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createCouponApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tạo coupon");
    }
  }
);

// 🧠 Admin tạo coupon và liên kết với DiscountCampaign
export const createCouponDiscountByAdmin = createAsyncThunk(
  "coupon/createByAdmin",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createCouponDiscountByAdminApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi admin tạo coupon"
      );
    }
  }
);

// ✏️ Cập nhật coupon
export const updateCoupon = createAsyncThunk(
  "coupon/update",
  async (data: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await updateCouponApi(data.id, data.payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi cập nhật coupon");
    }
  }
);

// 🗑️ Xóa coupon
export const deleteCoupon = createAsyncThunk(
  "coupon/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteCouponApi(id);
      return { response, id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi xóa coupon");
    }
  }
);

// 🎓 Lấy coupon của instructor hiện tại
export const fetchInstructorCoupons = createAsyncThunk(
  "coupon/fetchInstructorCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInstructorCouponsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải coupon của giảng viên"
      );
    }
  }
);

// 💰 Áp dụng coupon cho khóa học
export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async (data: { code: string; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await applyCouponApi(data.code, data.courseId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi áp dụng coupon");
    }
  }
);

// 📘 Lấy tất cả coupon của một khóa học
export const fetchCourseCoupons = createAsyncThunk(
  "coupon/fetchCourseCoupons",
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await getCourseCouponsApi(courseId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải coupon của khóa học"
      );
    }
  }
);

// 🧩 Slice
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCouponState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch all
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.data || [];
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tải danh sách coupon";
      })

      // 🔍 Fetch one
      .addCase(fetchCouponById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload;
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể tải chi tiết coupon";
      })

      // ➕ Create (Instructor)
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Tạo coupon thành công";
        state.instructorCoupons.push(action.payload.data);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi tạo coupon";
      })

      // 🧠 Create (Admin)
      .addCase(createCouponDiscountByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCouponDiscountByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Admin tạo coupon thành công";
        state.coupons.push(action.payload.data);
      })
      .addCase(createCouponDiscountByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi admin tạo coupon";
      })

      // ✏️ Update
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Cập nhật coupon thành công";
        state.instructorCoupons = state.instructorCoupons.map((c) =>
          c.id === action.payload.data.id ? action.payload.data : c
        );
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi cập nhật coupon";
      })

      // 🗑️ Delete
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.response.message ?? "Xóa coupon thành công";
        state.instructorCoupons = state.instructorCoupons.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi xóa coupon";
      })

      // 🎓 Instructor coupons
      .addCase(fetchInstructorCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorCoupons = action.payload.data || [];
      })
      .addCase(fetchInstructorCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể tải coupon của giảng viên";
      })

      // Coupon course
      .addCase(fetchCourseCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.courseCoupons = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data.coupons ?? [];
      })
      .addCase(fetchCourseCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Không thể tải coupon của khóa học";
      });
  },
});

export const { clearCouponState } = couponSlice.actions;
export default couponSlice.reducer;
