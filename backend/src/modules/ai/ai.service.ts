import { Injectable } from "@nestjs/common";
import { termPrompt } from "./prompts/term.prompt";
import { PrismaService } from "src/core/prisma/prisma.service";
import { ExplainTermDto } from "./dto/explain-term.dto";
import { ChatLessonDto } from "./dto/chat-lesson.dto";
import { VectorStoreService } from "src/core/lib/ai/vector-store.service";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async explainTerm(dto: ExplainTermDto) {
    try {
      const prompt = termPrompt({
        term: dto.term!,
        userLevel: dto.userLevel!,
        field: dto.field!,
      });

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      let content = chatCompletion.choices[0]?.message?.content || "";

      // Cleanup markdown code blocks if present
      if (content.includes("```")) {
        content = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
      }

      try {
        // Try to parse direct content first
        return JSON.parse(content);
      } catch (e) {
        // Fallback: try to extract JSON using regex if direct parse fails
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            console.error("Failed to parse extracted JSON:", jsonMatch[0]);
          }
        }

        console.error("Failed to parse AI response as JSON:", content);
        // last resort: return content as definition
        return {
          definition: content,
          example: "",
          note: "",
        };
      }
    } catch (error) {
      console.error("Groq AI Error:", error.message);

      // Xử lý lỗi quota nếu có
      if (error.status === 429) {
        return {
          definition: "Hệ thống đang bận, vui lòng thử lại sau giây lát.",
          error: true,
        };
      }

      throw error;
    }
  }

  async chatLesson(dto: ChatLessonDto): Promise<{ answer: string; hasContext: boolean }> {
    const { question, lessonId } = dto;

    // 1. Tìm kiếm ngữ cảnh liên quan từ DB (RAG)
    const relevantChunks = await this.vectorStoreService.search(question, lessonId, 3);
    const hasContext = relevantChunks.length > 0;

    const context = hasContext
      ? relevantChunks.map((c, i) => `[Đoạn ${i + 1}]: ${c.content}`).join("\n\n")
      : "";

    const systemPrompt = hasContext
      ? `Bạn là trợ lý AI học tập thông minh cho nền tảng E-Learning. Học viên đang xem một bài giảng video. Hãy trả lời câu hỏi của học viên DỰA TRÊN ngữ cảnh tài liệu từ bài giảng dưới đây. Trả lời bằng tiếng Việt, súc tích và dễ hiểu. Nếu ngữ cảnh không đủ để trả lời, hãy nói thật.\n\nNGỮ CẢNH TÀI LIỆU:\n${context}`
      : `Bạn là trợ lý AI học tập. Tài liệu của bài học này chưa được xử lý (AI chưa phân tích xong video). Hãy trả lời câu hỏi của học viên theo kiến thức chung của bạn và thông báo rằng tài liệu chưa được tích hợp. Luôn trả lời bằng tiếng Việt.`;

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.5,
    });

    const answer = completion.choices[0]?.message?.content || "Tôi không thể trả lời lúc này.";
    return { answer, hasContext };
  }
}
