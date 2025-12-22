# 🧠 E-LEARNING PLATFORM

Một hệ thống học trực tuyến (E-Learning) được xây dựng với **NestJS**, **Next.js**, và **React Native**, hỗ trợ người dùng học, mua khoá học, tương tác, và theo dõi tiến độ học tập.

---

## 🧭 TỔNG QUAN MODULES

Dự án gồm **7 module chính**:

1. 👤 **Auth & User Management**
2. 🎓 **INSTRUCTOR APPLICATION**
3. 🎓 **Courses & Lessons**  dl:18/10
4. 💬 **Learning Interaction** (Comment, Progress, Quiz) dl:23/10
5. 💳 **Payment** dl: 25/10
6. 📊 **Analytics & Tracking**  dl:5/11
7. ⚙️ **Admin Dashboard** dl:31/10

---

## 1️⃣ AUTHENTICATION & USER MANAGEMENT

### ✅ Backend (NestJS)

- Đăng ký (Email + Password)
- Đăng nhập (JWT Access & Refresh Token)
- Quên mật khẩu (Email OTP hoặc Link Reset)
- Cập nhật thông tin cá nhân (Tên, Avatar, ...)
- Xác thực tài khoản (Verify Account)
- Phân quyền: **student / instructor / admin**
- Middleware kiểm tra quyền truy cập

### ✅ Frontend Web (Next.js)

- Form đăng nhập / đăng ký
- Trang **Profile**
- Logout, lưu token vào **localStorage**
- Guard route (chặn trang cần đăng nhập)

### ✅ Mobile (React Native)

- Màn hình **Login / Register**
- Lưu token bằng **SecureStore / AsyncStorage**
- **Auto-login** khi mở app (nếu có token)

---

## 2️⃣ INSTRUCTOR APPLICATION

### ✅ Backend
#### 🧩 Chức năng chính
- Cho phép **người dùng gửi đơn đăng ký** để trở thành giảng viên.  
- Hỗ trợ **nhiều chuyên ngành (Specializations)** cho một người dùng.  
- Admin có thể **duyệt hoặc từ chối đơn**.  
- Gửi **email tự động** khi người dùng apply hoặc khi admin thay đổi trạng thái.  
### ✅ Web
- Trang **Apply Instructor**:
  - Form gồm: \`specialization[]\`, \`experience\`, \`bio\`
  - Gọi API apply instructor
  - Nếu chưa đăng nhập → chuyển đến \`/login\`
- Trang **Application Status**:
  - Hiển thị trạng thái: 🟡 Pending / ✅ Approved / ❌ Rejected
  - Cho phép **gửi lại đơn** nếu bị từ chối

---

### ✅ Mobile
- Màn hình **Apply Instructor** tương tự web  
- Dùng **Axios + SecureStore** để gửi API  
- Hiển thị **toast / modal** khi gửi đơn thành công 

---
## 3️⃣ COURSE MODULE (Khoá học & Bài học)

### ✅ Backend

- CRUD **Course** (title, description, thumbnail, price)
- CRUD **Lesson** (video URL, nội dung HTML)
- Phân loại (**Specialization**)
- Gắn bài học vào khoá học (1-n)
- Upload video lên **Cloudinary** hoặc storage
- Endpoint xem danh sách khoá học public

### ✅ Web

- Trang danh sách khoá học (**Search + Filter**)
- Trang chi tiết khoá học
- **Video Player** (Cloudinary hoặc iframe)
- Hiển thị danh sách bài học
- Trang **Tạo / Sửa khoá học** (Instructor)

### ✅ Mobile

- Danh sách khoá học (List View)
- Trang chi tiết khoá học
- Xem video (dùng `react-native-video`)
- Theo dõi **tiến độ học tập (Progress)**

---

## 4️⃣ LEARNING INTERACTION (Tương tác học tập)

### ✅ Backend

- API **Comment / Discussion** trong bài học
- API **Lưu tiến độ học tập** (đã xem bài X)
- API **Quiz** (câu hỏi trắc nghiệm – optional)
- API **Rating** (đánh giá khoá học)

### ✅ Web

- Comment dưới bài học
- Thanh **Progress Bar**
- Trang **Quiz** (nếu có)
- **Rating** khoá học

### ✅ Mobile

- Khu vực **Comment**
- Hiển thị tiến độ học
- Làm **Quiz** đơn giản (nếu có)

---

## 5️⃣ PAYMENT / SUBSCRIPTION (Thanh toán)

### ✅ Backend

- Tạo **Transaction** khi mua khoá học
- **Webhook** xác nhận thanh toán (VD: Sepay, Stripe,…)
- API lấy danh sách khoá học đã mua
- Hỗ trợ **Subscription Plan** (tháng / năm)

### ✅ Web

- Trang **Checkout** (chọn phương thức thanh toán)
- Trang **Khoá học đã mua (My Courses)**
- Xác nhận thanh toán qua webhook

### ✅ Mobile

- Màn hình **My Courses**
- Giao diện **Mua khoá học**
- Gọi API để mua / kiểm tra trạng thái thanh toán

---

## 6️⃣ ANALYTICS & TRACKING (Phân tích & Theo dõi)

### ✅ Backend

- **Log hành động** người dùng (UserActivity)
- Ghi lại **platform** (web / mobile)
- API thống kê:
  - Số người học
  - Tỉ lệ hoàn thành
  - Thiết bị sử dụng

### ✅ Web (Admin)

- **Dashboard thống kê:**
  - Tổng số học viên
  - Tỉ lệ Web vs Mobile
  - Top khoá học phổ biến

---

## 7️⃣ ADMIN DASHBOARD

### ✅ Backend

- CRUD **User, Course, Lesson, Payment**
- Quản lý **Instructor / Student**
- Thống kê theo thời gian

### ✅ Web

- Trang **Admin riêng (role = admin)**
- Quản lý danh sách **User**
- Quản lý **Khoá học (duyệt / xoá)**
- **Dashboard thống kê**

---

## 🏗️ TECH STACK

| Layer            | Công nghệ                                        |
| ---------------- | ------------------------------------------------ |
| **Frontend Web** | Next.js 15, React Query, Tailwind CSS, shadcn/ui |
| **Mobile**       | React Native, Expo, SecureStore                  |
| **Backend**      | NestJS, Prisma ORM, MySQL                        |
| **Auth**         | JWT (Access & Refresh Token), bcrypt, Email OTP  |
| **Storage**      | Cloudinary                 |
| **Payment**      | Sepay (Webhook xác nhận giao dịch)      |

---

## 📁 PROJECT STRUCTURE (Dự kiến)

/backend
/frontend
/mobile

## 💡 GỢI Ý MỞ RỘNG

- Thêm module **Notification** (Email / Push Notification)
- Tích hợp **AI Quiz Generator** (tự tạo câu hỏi từ nội dung bài học)
- Tích hợp **Realtime Chat** giữa học viên và instructor
- Tự động gợi ý khoá học liên quan (Recommendation Engine)

## 🧑‍💻 TÁC GIẢ

**Hoàng Văn Cường (FGW HN)**  
📍 _Việt Nam_  
🚀 _Backend Developer | Fullstack Learner_

---
