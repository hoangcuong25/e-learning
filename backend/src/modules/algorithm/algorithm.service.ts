import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { AlgorithmLanguage, AlgorithmStatus } from "@prisma/client";

@Injectable()
export class AlgorithmService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.algorithmCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getProblems(query: {
    categoryId?: number;
    difficulty?: any;
    search?: string;
  }) {
    const { categoryId, difficulty, search } = query;
    return this.prisma.algorithmProblem.findMany({
      where: {
        categoryId: categoryId ? Number(categoryId) : undefined,
        difficulty: difficulty || undefined,
        title: search ? { contains: search } : undefined,
      },
      include: {
        category: true,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getProblemBySlug(slug: string) {
    const problem = await this.prisma.algorithmProblem.findUnique({
      where: { slug },
      include: {
        category: true,
        testCases: {
          where: { isSample: true },
        },
      },
    });

    if (!problem) {
      throw new NotFoundException("Problem not found");
    }

    return problem;
  }

  async createSubmission(
    userId: number,
    data: { problemId: number; code: string; language: AlgorithmLanguage }
  ) {
    // 1. Create submission record
    const submission = await this.prisma.algorithmSubmission.create({
      data: {
        userId,
        problemId: Number(data.problemId),
        code: data.code,
        language: data.language,
        status: AlgorithmStatus.PENDING,
      },
    });

    // 2. Perform evaluation (Mocking for now)
    // In a real scenario, this would trigger a background job or call a judge service
    this.evaluateSubmission(submission.id);

    return submission;
  }

  private async evaluateSubmission(submissionId: number) {
    // Mock evaluation logic
    setTimeout(async () => {
      const submission = await this.prisma.algorithmSubmission.findUnique({
        where: { id: submissionId },
        include: { problem: { include: { testCases: true } } },
      });

      if (!submission) return;

      // Simple mock: 80% pass, 20% wrong answer
      const isPassed = Math.random() > 0.2;

      await this.prisma.algorithmSubmission.update({
        where: { id: submissionId },
        data: {
          status: isPassed
            ? AlgorithmStatus.ACCEPTED
            : AlgorithmStatus.WRONG_ANSWER,
          executionTime: Math.floor(Math.random() * 200) + 50,
          memoryUsed: Math.floor(Math.random() * 5000) + 1000,
        },
      });
    }, 2000);
  }

  async getSubmissionStatus(submissionId: number) {
    return this.prisma.algorithmSubmission.findUnique({
      where: { id: Number(submissionId) },
    });
  }

  async getUserSubmissions(userId: number, problemId?: number) {
    return this.prisma.algorithmSubmission.findMany({
      where: {
        userId,
        problemId: problemId ? Number(problemId) : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        problem: {
          select: { title: true, slug: true },
        },
      },
    });
  }
}
