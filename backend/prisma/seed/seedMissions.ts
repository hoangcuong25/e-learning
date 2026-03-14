import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedMissions() {
  console.log("⏳ Seeding Missions...");

  const missionsData = [
    {
      title: "Online 15 Phút",
      description: "Duy trì trực tuyến 15 phút trong ngày.",
      type: "ONLINE_TIME" as const,
      requirement: 15,
      rewardAmount: 500,
      isActive: true,
    },
    {
      title: "Online 30 Phút",
      description: "Duy trì trực tuyến 30 phút trong ngày.",
      type: "ONLINE_TIME" as const,
      requirement: 30,
      rewardAmount: 500,
      isActive: true,
    },
    {
      title: "Online 60 Phút",
      description: "Duy trì trực tuyến 60 phút trong ngày.",
      type: "ONLINE_TIME" as const,
      requirement: 60,
      rewardAmount: 1000,
      isActive: true,
    },
  ];

  await prisma.mission.deleteMany({});

  await prisma.mission.createMany({
    data: missionsData,
  });

  console.log("✅ Seed Missions hoàn tất!");
}
