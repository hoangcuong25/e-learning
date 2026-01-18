import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const specializations = [
    {
      name: "Web Development",
      desc:
        "Phát triển ứng dụng web sử dụng công nghệ như React, Angular, Node.js...",
    },
    {
      name: "Mobile Development",
      desc:
        "Xây dựng ứng dụng di động cho Android và iOS bằng Flutter, React Native...",
    },
    {
      name: "UI/UX Design",
      desc:
        "Thiết kế giao diện người dùng và trải nghiệm người dùng trực quan, hiệu quả.",
    },
    {
      name: "Data Science",
      desc: "Phân tích dữ liệu, machine learning, và trí tuệ nhân tạo.",
    },
    {
      name: "Cyber Security",
      desc: "An toàn thông tin và bảo mật hệ thống mạng.",
    },
    {
      name: "Cloud Computing",
      desc: "Làm việc với nền tảng đám mây như AWS, GCP, Azure.",
    },
    {
      name: "Game Development",
      desc:
        "Phát triển trò chơi với Unity, Unreal Engine hoặc công nghệ khác.",
    },
    {
      name: "DevOps",
      desc:
        "Tự động hóa triển khai và quản lý hạ tầng bằng Docker, Kubernetes, CI/CD.",
    },
  ];

  for (const s of specializations) {
    await prisma.specialization.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  console.log("✅ Seed dữ liệu Specialization thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
