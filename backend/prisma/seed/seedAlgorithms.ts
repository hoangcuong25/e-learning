import { PrismaClient, AlgorithmDifficulty } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAlgorithms() {
  console.log("🚀 Seeding algorithms...");

  const categories = [
    {
      name: "Array & Hashing",
      slug: "array-hashing",
      description: "Các bài toán về mảng và bảng băm",
    },
    {
      name: "Two Pointers",
      slug: "two-pointers",
      description: "Kỹ thuật hai con trỏ",
    },
    {
      name: "Sliding Window",
      slug: "sliding-window",
      description: "Cửa sổ trượt",
    },
    { name: "Stack", slug: "stack", description: "Ngăn xếp" },
    {
      name: "Binary Search",
      slug: "binary-search",
      description: "Tìm kiếm nhị phân",
    },
  ];

  for (const cat of categories) {
    await prisma.algorithmCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const arrayCat = await prisma.algorithmCategory.findUnique({
    where: { slug: "array-hashing" },
  });

  if (arrayCat) {
    const problems = [
      {
        title: "Two Sum",
        slug: "two-sum",
        description:
          "Cho một mảng số nguyên `nums` và một số nguyên `target`, hãy tìm chỉ số của hai số sao cho tổng của chúng bằng `target`.",
        difficulty: AlgorithmDifficulty.EASY,
        categoryId: arrayCat.id,
        testCases: {
          create: [
            {
              input: "[2,7,11,15], 9",
              expectedOutput: "[0,1]",
              isSample: true,
            },
            { input: "[3,2,4], 6", expectedOutput: "[1,2]", isSample: true },
          ],
        },
      },
      {
        title: "Contains Duplicate",
        slug: "contains-duplicate",
        description:
          "Cho một mảng số nguyên, trả về `true` nếu bất kỳ giá trị nào xuất hiện ít nhất hai lần trong mảng, và trả về `false` nếu mỗi phần tử đều khác nhau.",
        difficulty: AlgorithmDifficulty.EASY,
        categoryId: arrayCat.id,
        testCases: {
          create: [
            { input: "[1,2,3,1]", expectedOutput: "true", isSample: true },
            { input: "[1,2,3,4]", expectedOutput: "false", isSample: true },
          ],
        },
      },
    ];

    for (const prob of problems) {
      await prisma.algorithmProblem.upsert({
        where: { slug: prob.slug },
        update: {},
        create: prob,
      });
    }
  }

  console.log("✅ Algorithm seeding completed.");
}
