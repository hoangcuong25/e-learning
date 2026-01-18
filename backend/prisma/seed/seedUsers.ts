import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const seedUsers = async () => {
  const users = [
    {
      fullname: "Nguyễn Văn A",
      email: "Pa@gmail.com",
      password: "123456",
    },
    {
      fullname: "Trần Thị B",
      email: "Mb@gmail.com",
      password: "123456",
    },
    {
      fullname: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
    },
    {
      fullname: "Trần Thị B",
      email: "Gb@gmail.com",
      password: "123456",
    },
    {
      fullname: "Trần Thị C",
      email: "HC@gmail.com",
      password: "123456",
    },
    {
      fullname: "Trần Thị D",
      email: "D@gmail.com",
      password: "123456",
    },
    {
      fullname: "Nguyễn Văn PP",
      email: "aPP@gmail.com",
      password: "123456",
    },
    {
      fullname: "Nguyễn Văn B",
      email: "BA@gmail.com",
      password: "123456",
    },
    {
      fullname: "Nguyễn Văn D",
      email: "Da@gmail.com",
      password: "123456",
    },
  ];

  for (const u of users) {
    // Mã hóa mật khẩu trước khi seed
    const hashedPassword = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        fullname: u.fullname,
        email: u.email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });
  }

  console.log("✅ Seed dữ liệu User thành công!");
};
