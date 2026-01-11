export {};

declare global {
  // 🧩 Enums
  type ReportTargetType = import("@/constants/report.enum").ReportTargetType;
  type ReportReason = import("@/constants/report.enum").ReportReason;
  type ReportStatus = import("@/constants/report.enum").ReportStatus;
  type GenderEnum = import("@/constants/gender.enum").GenderEnum;

  type PaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    specialization?: string;
  };

  type UserType = {
    id: number;
    fullname: string;
    email: string;
    avatar: string;
    gender: GenderEnum;
    dob: string;
    address: string;
    phone: string;
    isVerified: boolean;
    role: string;
    walletBalance: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
  };

  type UserUpdateResponseType = {
    id: string;
    fullname: string;
    avatar: string;
    gender: GenderEnum;
    dob: string;
    address: string;
    phone: string;
  };

  type InstructorApplicationType = {
    id: number;
    userId: number;
    experience?: string;
    bio?: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedAt?: string;
    reviewedBy?: number;
    createdAt: string;
    updatedAt: string;
    applicationSpecializations?: {
      specialization: {
        id: number;
        name: string;
        desc?: string;
      };
    }[];
    user?: {
      id: number;
      fullname: string;
      email: string;
    };
  };

  type SpecializationType = {
    id: number;
    name: string;
    desc?: string;
    createdAt: string;
    updatedAt: string;
  };

  // 🧩 CourseType — đại diện cho một khóa học
  type CourseType = {
    lessons: any;
    chapter: ChapterType[];
    coupon: CouponType[];
    id: number;
    title: string;
    description?: string;
    thumbnail?: string;
    duration: number;
    type: string;
    price: number;
    isPublished: boolean;
    totalRating: number;
    averageRating: number;
    courseRating: any[];
    viewCount: number;
    isEnrolled: boolean;

    _count?: {
      chapter: number; // Số lượng Chapters
      courseView: number;
    };

    instructorId: number;
    instructor?: Pick<UserType, "id" | "fullname" | "email" | "avatar">;

    // Danh sách chuyên ngành / chủ đề (qua bảng trung gian)
    specializations?: {
      specialization: SpecializationType;
    }[];

    lessonProgresses: LessonProgressType[];

    createdAt: string;
    updatedAt: string;
  };

  // 🧩 LessonType — cho từng bài học trong khóa
  type LessonType = {
    id: number;
    title: string;
    content?: string;
    videoUrl?: string;
    orderIndex: number;
    duration: number; // Thời lượng bài học
    chapter: ChapterType;
    quizzes?: QuizType[];
    courseId: number;
    course?: Pick<CourseType, "id" | "title">;
    createdAt: string;
    updatedAt: string;
  };

  // 🧩 CourseSpecializationType — mapping Course ↔ Specialization
  type CourseSpecializationType = {
    courseId: number;
    specializationId: number;
    specialization?: SpecializationType;
  };

  // 🧩 OptionType — đại diện cho từng lựa chọn (đáp án)
  type OptionType = {
    id: number;
    text: string; // Nội dung lựa chọn
    isCorrect: boolean; // Có phải đáp án đúng không
    questionId: number;
    createdAt: string;
    updatedAt: string;
  };

  // 🧩 QuestionType — đại diện cho một câu hỏi trong quiz
  type QuestionType = {
    id: number;
    questionText: string; // Nội dung câu hỏi
    quizId: number;
    options?: OptionType[]; // Danh sách lựa chọn
    createdAt: string;
    updatedAt: string;
  };

  // 🧩 QuizType — đại diện cho bài quiz (gắn với 1 lesson duy nhất)
  type QuizType = {
    _count: any;
    id: number;
    title: string; // Tên quiz
    lessonId: number;
    lesson?: Pick<LessonType, "id" | "title" | "orderIndex" | "courseId" | any>; // Thông tin bài học
    questions?: QuestionType[]; // Danh sách câu hỏi
    createdAt: string;
    updatedAt: string;
  };

  type ChapterType = {
    id: number;
    title: string;
    description?: string;
    courseId: number;
    orderIndex: number;
    lessons?: LessonType[];
    createdAt?: string;
    updatedAt?: string;
  };

  enum CouponTargetEnum {
    ALL = "ALL",
    COURSE = "COURSE",
    SPECIALIZATION = "SPECIALIZATION",
  }

  type CouponType = {
    id: number;
    code: string;
    percentage: number; // % giảm giá
    maxUsage?: number | null; // Giới hạn số lần dùng
    usedCount: number; // Số lần đã dùng
    startsAt?: string | null; // Ngày bắt đầu
    endsAt?: string | null; // Ngày kết thúc
    isActive: boolean;
    target: CouponTargetEnum;

    // Quan hệ
    createdById: number;
    createdBy?: Pick<UserType, "id" | "fullname" | "email">;

    courseId?: number | null;
    course?: Pick<CourseType, "id" | "title"> | null;

    specializationId?: number | null;
    specialization?: Pick<SpecializationType, "id" | "name"> | null;

    // Các quan hệ phụ
    couponUsages?: CouponUsageType[];
    discountCampaigns?: DiscountCampaignType[];

    createdAt: string;
    updatedAt: string;
  };

  type CouponUsageType = {
    id: number;
    couponId: number;
    userId: number;
    usedAt: string;

    coupon?: Pick<CouponType, "id" | "code" | "percentage">;
    user?: Pick<UserType, "id" | "fullname" | "email">;
  };

  type DiscountCampaignType = {
    id: number;
    title: string;
    description?: string;
    percentage: number;
    startsAt: string;
    endsAt: string;
    isActive: boolean;

    createdById: number;
    createdBy?: Pick<UserType, "id" | "fullname">;

    coupons?: Pick<CouponType, "id" | "code" | "percentage">[];

    createdAt: string;
    updatedAt: string;
  };

  // 🧩 EnrollmentType — đại diện cho bản ghi đăng ký khóa học
  type EnrollmentType = {
    id: number;

    // Quan hệ chính
    userId: number;
    courseId: number;

    enrolledAt: string;
    completedAt?: string | null;
    progress: number; // phần trăm tiến độ (0–100)

    // Nếu có coupon áp dụng
    couponId?: number | null;
    coupon?: Pick<
      CouponType,
      "id" | "code" | "percentage" | "isActive" | "startsAt" | "endsAt"
    > | null;

    // Thông tin quan hệ
    user?: UserType;
    course?: CourseType;

    createdAt?: string;
    updatedAt?: string;
  };

  type LessonProgressType = {
    id: number;
    userId: number;
    lessonId: number;
    courseId: number;

    isCompleted: boolean;
    completedAt?: string | null;

    user?: Pick<UserType, "id" | "fullname" | "email" | "avatar">;
    lesson?: Pick<LessonType, "id" | "title" | "orderIndex" | "courseId">;
    course?: Pick<CourseType, "id" | "title" | "thumbnail">;

    createdAt?: string;
    updatedAt?: string;
  };
  type CartItemType = {
    id: number;
    courseId: number;
    course: CourseType;
    quantity?: number;
  };

  type ReplyType = {
    id: number;
    content: string;
    user: UserType;
    createdAt: string;
  };

  type AnswerType = {
    id: number;
    content: string;
    user: UserType;
    replies: ReplyType[];
    createdAt: string;
  };

  type DiscussionQuestionType = {
    id: number;
    content: string;
    user: UserType;
    answers: AnswerType[];
    createdAt: string;
  };

  type NotificationType = {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    userId: number;
    link?: string;
  };

  // 🧩 PostType
  type PostType = {
    id: number;
    content: string;
    media?: { url: string; type: "IMAGE" | "VIDEO" }[];
    authorId: number;
    author?: Pick<UserType, "id" | "fullname" | "avatar">;
    isLiked?: boolean; // Cho frontend check xem user hiện tại đã like chưa
    createdAt: string;
    updatedAt: string;
    comments?: CommentType[];
    _count?: {
      likes: number;
      comments: number;
      shares: number;
    };
  };

  // 🧩 CommentType
  type CommentType = {
    id: number;
    content: string;
    postId: number;
    userId: number;
    user?: Pick<UserType, "id" | "fullname" | "avatar">;
    parentId?: number | null; // Nếu là reply
    replies?: CommentType[];
    createdAt: string;
    updatedAt: string;
  };

  // 🧩 ReportType
  type ReportType = {
    id: number;
    reporterId: number;
    targetType: ReportTargetType;
    targetId: number;
    reason: ReportReason;
    description?: string;
    status: ReportStatus;
    reviewedBy?: number;
    reviewedAt?: string;

    reporter?: Pick<UserType, "id" | "fullname" | "email" | "avatar">;

    createdAt: string;
    updatedAt: string;
  };
}
