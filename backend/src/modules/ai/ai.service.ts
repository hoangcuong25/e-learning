import { Injectable } from "@nestjs/common";
import { termPrompt } from "./prompts/term.prompt";
import { PrismaService } from "src/core/prisma/prisma.service";
import { ExplainTermDto } from "./dto/explain-term.dto";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  constructor(private readonly prisma: PrismaService) {}

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
}
