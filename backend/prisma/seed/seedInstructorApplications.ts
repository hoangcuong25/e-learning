import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const seedInstructorApplications = async () => {
  console.log("🌱 Seeding Instructor Applications...");

  // Lấy tối đa 10 user có role USER
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    take: 10,
  });

  if (users.length === 0) {
    console.warn(
      "⚠️ Không có user nào để tạo InstructorApplication. Hãy seed user trước!"
    );
    return;
  }

  // Lấy tất cả chuyên ngành có sẵn
  const specializations = await prisma.specialization.findMany();

  if (specializations.length === 0) {
    console.warn(
      "⚠️ Không có specialization nào. Hãy seed specialization trước!"
    );
    return;
  }

  // Dữ liệu mẫu cho 10 ứng viên
  const bios = [
    "Tôi là lập trình viên Frontend với hơn 3 năm kinh nghiệm làm việc với React và TypeScript.",
    "Tôi đam mê phát triển di động và có kinh nghiệm với Flutter và React Native.",
    "Tôi yêu thích việc phân tích dữ liệu và chia sẻ kiến thức về Machine Learning.",
    "Giảng viên có hơn 5 năm kinh nghiệm trong thiết kế UI/UX và tư duy sản phẩm.",
    "Tôi làm việc trong lĩnh vực bảo mật hệ thống và có chứng chỉ CEH, CISSP.",
    "Tôi là DevOps Engineer, chuyên về CI/CD và quản lý hạ tầng cloud.",
    "Tôi đã phát triển nhiều trò chơi indie bằng Unity và Unreal Engine.",
    "Giảng viên backend với hơn 4 năm kinh nghiệm sử dụng Node.js và NestJS.",
    "Tôi chuyên về điện toán đám mây với AWS và Azure, thích tự động hóa hạ tầng.",
    "Tôi là kỹ sư phần mềm fullstack, yêu thích chia sẻ và mentoring sinh viên.",
  ];

  for (let i = 0; i < users.length && i < 10; i++) {
    const user = users[i];

    // Kiểm tra nếu user đã có application
    const existing = await prisma.instructorApplication.findFirst({
      where: { userId: user.id },
    });
    if (existing) continue;

    // Chọn ngẫu nhiên 1 trạng thái
    const statuses = [
      ApplicationStatus.PENDING,
      ApplicationStatus.APPROVED,
      ApplicationStatus.REJECTED,
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Tạo application
    const application = await prisma.instructorApplication.create({
      data: {
        userId: user.id,
        experience: `${Math.floor(Math.random() * 5) + 1} năm kinh nghiệm giảng dạy.`,
        bio: bios[i],
        status: randomStatus,
        reviewedAt:
          randomStatus !== ApplicationStatus.PENDING ? new Date() : null,
        reviewedBy: null,
      },
    });

    // Chọn 1–3 chuyên ngành ngẫu nhiên
    const randomSpecs = specializations
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    for (const spec of randomSpecs) {
      await prisma.applicationSpecializations.create({
        data: {
          applicationId: application.id,
          specializationId: spec.id,
        },
      });
    }

    console.log(`✅ Tạo InstructorApplication cho user ${user.fullname}`);
  }

  console.log("🎓 Seed 10 InstructorApplications thành công!");
};
