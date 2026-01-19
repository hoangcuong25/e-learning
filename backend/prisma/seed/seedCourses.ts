import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedCourses = async () => {
  console.log("🌱 Seeding Courses...");

  // Lấy danh sách instructor đã được duyệt
  const approvedInstructors = await prisma.instructorApplication.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
  });

  if (approvedInstructors.length === 0) {
    console.warn("⚠️ Không có giảng viên nào được duyệt để tạo khóa học!");
    return;
  }

  const thumbnailUrl =
    "https://res.cloudinary.com/dtaawt3ej/image/upload/v1747292486/q9lmgugyqgrm7q5voatw.jpg";

  const sampleCourses = [
    {
      title: "Khóa học ReactJS Cơ bản đến Nâng cao",
      description:
        "Khóa học giúp bạn nắm vững React, JSX, hooks, và cách xây dựng ứng dụng thực tế.",
      price: 499000,
    },
    {
      title: "Lập trình Node.js với NestJS",
      description:
        "Học cách xây dựng backend mạnh mẽ, bảo mật và dễ mở rộng với NestJS.",
      price: 599000,
    },
    {
      title: "Thiết kế UI/UX hiện đại với Figma",
      description:
        "Khóa học hướng dẫn quy trình thiết kế trải nghiệm người dùng chuyên nghiệp.",
      price: 399000,
    },
    {
      title: "Phát triển ứng dụng di động với React Native",
      description:
        "Tạo ứng dụng cross-platform hoàn chỉnh bằng React Native và Expo.",
      price: 699000,
    },
    {
      title: "Cấu trúc dữ liệu & Giải thuật cho lập trình viên",
      description:
        "Nắm vững các thuật toán cốt lõi và cấu trúc dữ liệu giúp bạn phỏng vấn thành công.",
      price: 299000,
    },
  ];

  for (let i = 0; i < sampleCourses.length; i++) {
    const course = sampleCourses[i];
    const instructor = approvedInstructors[i % approvedInstructors.length].user; // Phân bổ đều

    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        price: course.price,
        thumbnail: thumbnailUrl,
        instructorId: instructor.id,
      },
    });

    console.log(
      `✅ Tạo khóa học: ${course.title} (GV: ${instructor.fullname})`
    );
  }

  console.log("🎉 Seed Courses thành công!");
};
