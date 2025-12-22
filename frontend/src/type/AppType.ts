export {};

declare global {
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
    id: number;
    title: string;
    description?: string;
    thumbnail?: string;
    price: number;
    isPublished: boolean;

    instructorId: number;
    instructor?: Pick<UserType, "id" | "fullname" | "email" | "avatar">;

    // Danh sách bài học
    lessons?: LessonType[];

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
    courseId: number;
    createdAt: string;
    updatedAt: string;
  };

  // 🧩 CourseSpecializationType — mapping Course ↔ Specialization
  type CourseSpecializationType = {
    courseId: number;
    specializationId: number;
    specialization?: SpecializationType;
  };
}
