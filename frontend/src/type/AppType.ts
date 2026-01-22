export {};

declare global {
  type PaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  };

  type UserType = {
    id: number;
    fullname: string;
    email: string;
    avatar: string;
    gender: string;
    dob: string;
    address: string;
    phone: string;
    isVerified: boolean;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
  };

  type UserUpdateResponseType = {
    id: string;
    fullname: string;
    avatar: string;
    age: string;
    gender: genderEnum;
    dob: string;
    address: string;
    phone: string;
  };

  enum genderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
  }

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
    chapter: ChapterType[];
    id: number;
    title: string;
    description?: string;
    thumbnail?: string;
    price: number;
    isPublished: boolean;

    instructorId: number;
    instructor?: Pick<UserType, "id" | "fullname" | "email" | "avatar">;

    // Danh sách chuyên ngành / chủ đề (qua bảng trung gian)
    specializations?: {
      specialization: SpecializationType;
    }[];

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
    lesson?: Pick<LessonType, "id" | "title" | "orderIndex" | "courseId">; // Thông tin bài học (nếu có)
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
}
