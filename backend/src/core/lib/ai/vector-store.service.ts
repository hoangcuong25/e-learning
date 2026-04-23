import { Injectable } from "@nestjs/common";
import { getEmbedding } from "./localEmbedding";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class VectorStoreService {
  constructor(private readonly prisma: PrismaService) {}

  // Hàm tính khoảng cách Cosine Similarity giữa 2 vector
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Tìm kiếm ngữ cảnh liên quan (RAG)
  async search(question: string, lessonId: number, limit: number = 3) {
    // 1. Sinh vector nhúng cho câu hỏi
    const queryEmbedding = await getEmbedding(question);

    // 2. Lấy tất cả các chunks của bài học từ DB
    const chunks = await this.prisma.lessonChunk.findMany({
      where: { lessonId },
    });

    if (!chunks || chunks.length === 0) {
      return [];
    }

    // 3. Tính điểm similarity
    const results = chunks.map((item) => {
      // Embedding được lưu dưới dạng Json trong database
      const itemEmbedding = item.embedding as number[];
      return {
        id: item.id,
        content: item.content,
        score: this.cosineSimilarity(queryEmbedding, itemEmbedding),
      };
    });

    // 4. Sắp xếp giảm dần theo score
    results.sort((a, b) => b.score - a.score);

    // 5. Lấy top kết quả
    return results.slice(0, limit);
  }
}
