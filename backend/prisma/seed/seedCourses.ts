
import { CourseType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedCourses = async () => {
  console.log("🌱 Seeding Courses...");

  const approvedInstructors = await prisma.instructorApplication.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
  });

  if (approvedInstructors.length === 0) {
    console.warn("⚠️ No approved instructors found to create courses!");
    return;
  }

  const specializations = await prisma.specialization.findMany();
  if (specializations.length === 0) {
    console.warn("⚠️ No specializations found to assign to courses!");
    return;
  }

  const thumbnailUrl =
    "https://res.cloudinary.com/dtaawt3ej/image/upload/v1747292486/q9lmgugyqgrm7q5voatw.jpg";

  const coursesData = [
    {
      title: "Khóa học ReactJS Cơ bản đến Nâng cao",
      description:
        "Khóa học giúp bạn nắm vững React, JSX, hooks, và cách xây dựng ứng dụng thực tế.",
      price: 499000,
      type: CourseType.PAID,
      isPublished: true,
      duration: 720, // 12 hours
      specializationNames: ["Phát triển Web", "React"],
      chapters: [
        {
          title: "Chương 1: Giới thiệu về React",
          lessons: [
            { title: "Bài 1: React là gì?", duration: 15 },
            { title: "Bài 2: Cài đặt môi trường", duration: 25 },
          ],
        },
        {
          title: "Chương 2: Component và Props",
          lessons: [
            { title: "Bài 3: Function Component", duration: 30 },
            { title: "Bài 4: Class Component", duration: 35 },
          ],
        },
      ],
    },
    {
      title: "Lập trình Node.js với NestJS",
      description:
        "Học cách xây dựng backend mạnh mẽ, bảo mật và dễ mở rộng với NestJS.",
      price: 599000,
      type: CourseType.PAID,
      isPublished: true,
      duration: 960, // 16 hours
      specializationNames: ["Phát triển Web", "Backend", "Node.js"],
      chapters: [
        {
          title: "Chương 1: Bắt đầu với NestJS",
          lessons: [
            { title: "Bài 1: Giới thiệu NestJS", duration: 20 },
            { title: "Bài 2: Controllers và Services", duration: 40 },
          ],
        },
      ],
    },
    {
      title: "Thiết kế UI/UX hiện đại với Figma",
      description:
        "Khóa học hướng dẫn quy trình thiết kế trải nghiệm người dùng chuyên nghiệp.",
      price: 0,
      type: CourseType.FREE,
      isPublished: true,
      duration: 480, // 8 hours
      specializationNames: ["Thiết kế UI/UX"],
      chapters: [
        {
          title: "Chương 1: Làm quen với Figma",
          lessons: [{ title: "Bài 1: Giao diện và công cụ", duration: 45 }],
        },
      ],
    },
    {
      title: "Phát triển ứng dụng di động với React Native",
      description:
        "Tạo ứng dụng cross-platform hoàn chỉnh bằng React Native và Expo.",
      price: 699000,
      type: CourseType.PAID,
      isPublished: false, // Unpublished course
      duration: 1200, // 20 hours
      specializationNames: ["Phát triển di động", "React"],
      chapters: [],
    },
    {
      title: "Cấu trúc dữ liệu & Giải thuật",
      description:
        "Nắm vững các thuật toán cốt lõi và cấu trúc dữ liệu để phỏng vấn thành công.",
      price: 299000,
      type: CourseType.PAID,
      isPublished: true,
      duration: 600, // 10 hours
      specializationNames: ["Thuật toán", "Phát triển Web"],
      chapters: [
        {
          title: "Chương 1: Mảng và Chuỗi",
          lessons: [
            { title: "Bài 1: Thao tác với mảng", duration: 50 },
            { title: "Bài 2: Các bài toán chuỗi phổ biến", duration: 70 },
          ],
        },
      ],
    },
  ];

  for (let i = 0; i < coursesData.length; i++) {
    const courseData = coursesData[i];
    const instructor = approvedInstructors[i % approvedInstructors.length].user;

    const courseSpecializations = specializations
      .filter((s) => courseData.specializationNames.includes(s.name))
      .map((s) => ({
        specialization: {
          connect: { id: s.id },
        },
      }));

    const createdCourse = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        thumbnail: thumbnailUrl,
        instructorId: instructor.id,
        type: courseData.type,
        isPublished: courseData.isPublished,
        duration: courseData.duration,
        specializations: {
          create: courseSpecializations,
        },
        chapter: {
          create: courseData.chapters.map((chapter, chapterIndex) => ({
            title: chapter.title,
            orderIndex: chapterIndex,
            lessons: {
              create: chapter.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title,
                duration: lesson.duration,
                orderIndex: lessonIndex,
                videoUrl:
                  "https://res.cloudinary.com/dtaawt3ej/video/upload/v1747292486/sample.mp4",
              })),
            },
          })),
        },
      },
    });

    console.log(
      `✅ Created course: ${createdCourse.title} (Instructor: ${instructor.fullname})`
    );
  }

  console.log("🎉 Seed Courses completed successfully!");
};
