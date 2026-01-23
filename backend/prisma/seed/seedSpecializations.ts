import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedSpecializations = async () => {
  const specializations = [
    {
      name: "Phát triển Web",
      desc: "Phát triển ứng dụng web sử dụng công nghệ như React, Angular, Node.js...",
    },
    {
      name: "Phát triển di động",
      desc: "Xây dựng ứng dụng di động cho Android và iOS bằng Flutter, React Native...",
    },
    {
      name: "Thiết kế UI/UX",
      desc: "Thiết kế giao diện người dùng và trải nghiệm người dùng trực quan, hiệu quả.",
    },
    {
      name: "Khoa học dữ liệu",
      desc: "Phân tích dữ liệu, machine learning, và trí tuệ nhân tạo.",
    },
    {
      name: "An ninh mạng",
      desc: "An toàn thông tin và bảo mật hệ thống mạng.",
    },
    {
      name: "Điện toán đám mây",
      desc: "Làm việc với nền tảng đám mây như AWS, GCP, Azure.",
    },
    {
      name: "Phát triển game",
      desc: "Phát triển trò chơi với Unity, Unreal Engine hoặc công nghệ khác.",
    },
    {
      name: "DevOps",
      desc: "Tự động hóa triển khai và quản lý hạ tầng bằng Docker, Kubernetes, CI/CD.",
    },
    {
      name: "Backend",
      desc: "Phát triển logic phía máy chủ, cơ sở dữ liệu và API cho ứng dụng.",
    },
    {
      name: "Thuật toán",
      desc: "Nghiên cứu và áp dụng các thuật toán để giải quyết vấn đề tính toán.",
    },
  ];

  for (const s of specializations) {
    await prisma.specialization.upsert({
      where: { name: s.name },
      update: { desc: s.desc },
      create: s,
    });
  }

  console.log("✅ Seed Specializations completed successfully!");
};
