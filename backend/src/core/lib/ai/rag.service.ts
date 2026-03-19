import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import OpenAI from "openai";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { getEmbedding } from "./localEmbedding";

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  // 1. Chuyển Cloudinary .mp4 sang .mp3 và tải về
  private async downloadAudio(videoUrl: string, tmpFilePath: string): Promise<boolean> {
    try {
      // Ví dụ URL: https://res.cloudinary.com/xyz/video/upload/v123/file.mp4
      // Đổi định dạng thành .mp3 để nhờ Cloudinary tự extract âm thanh
      const audioUrl = videoUrl.replace(/\.(mp4|mkv|webm|mov)$/i, ".mp3");
      this.logger.log(`Downloading audio from: ${audioUrl}`);

      const response = await axios({
        url: audioUrl,
        method: "GET",
        responseType: "stream",
      });

      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(tmpFilePath);
        response.data.pipe(writer);
        writer.on("finish", () => resolve(true));
        writer.on("error", reject);
      });
    } catch (error) {
      this.logger.error("Error downloading audio:", error.message);
      return false;
    }
  }

  // 2. Chuyển đổi giọng nói thành văn bản bằng Groq Whisper
  private async voiceToText(audioFilePath: string): Promise<string> {
    this.logger.log("Transcribing audio using Whisper model...");
    try {
      // Types for OpenAI.audio.transcriptions.create technically expect a Buffer or File object.
      // We pass the read stream for Node.js usage.
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath) as any,
        model: "whisper-large-v3",
        response_format: "text",
        language: "vi", // Hoặc bỏ trống để tự phát hiện
      });
      return transcription as unknown as string;
    } catch (error) {
      this.logger.error("Error in STT:", error.message);
      throw error;
    }
  }

  // 3. Chia nhỏ văn bản (Chunking)
  private splitTextIntoChunks(text: string, chunkSize = 500, overlap = 50): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      const end = Math.min(i + chunkSize, text.length);
      const chunk = text.substring(i, end);
      chunks.push(chunk);
      i += chunkSize - overlap;
    }
    return chunks;
  }

  /**
   * Main function: Xử lý toàn bộ logic RAG cho 1 Lesson video
   */
  async processLessonVideo(lessonId: number, videoUrl: string) {
    const tmpFilePath = path.join("/tmp", `lesson_${lessonId}.mp3`);
    try {
      // Đảm bảo thư mục lưu tồn tại (trên Windows có thể /tmp gây lỗi nếu không handle tốt)
      const tmpDir = path.resolve("./tmp");
      if (!fs.existsSync(tmpDir)) {
         fs.mkdirSync(tmpDir, { recursive: true });
      }
      const actualTmpFilePath = path.join(tmpDir, `lesson_${lessonId}.mp3`);

      // 1. Lấy Audio file
      this.logger.log(`Starting background AI pipeline for lesson ${lessonId}`);
      const isDownloaded = await this.downloadAudio(videoUrl, actualTmpFilePath);
      if (!isDownloaded) {
        throw new Error("Không thể tải file âm thanh");
      }

      // 2. Chuyển thành văn bản (STT)
      const transcript = await this.voiceToText(actualTmpFilePath);

      // 3. Cập nhật Lesson với transcript
      await this.prisma.lesson.update({
        where: { id: lessonId },
        data: { transcript },
      });

      // 4. Chunking & Embedding
      const chunksStr = this.splitTextIntoChunks(transcript);
      this.logger.log(`Generated ${chunksStr.length} chunks. Generating embeddings...`);
      
      const chunkRecords = [];
      for (const chunk of chunksStr) {
        // Dùng local model để cắt chi phí, hoặc dùng "text-embedding-v3-small" (nếu Groq hỗ trợ embedding, nhưng hiện tại Groq KHÔNG hỗ trợ embedding endpoint, do đó dùng localEmbedding)
        const vector = await getEmbedding(chunk); 
        chunkRecords.push({
          lessonId,
          content: chunk,
          embedding: vector, 
        });
      }

      // 6. Lưu vào cơ sở dữ liệu
      if (chunkRecords.length > 0) {
        await this.prisma.lessonChunk.createMany({
          data: chunkRecords,
        });
      }

      this.logger.log(`Successfully finished AI RAG pipeline for lesson ${lessonId}`);

    } catch (error) {
      this.logger.error(`Pipeline failed for lesson ${lessonId}:`, error);
    } finally {
      // Dọn dẹp file tạm
      const tmpFile = path.resolve("./tmp", `lesson_${lessonId}.mp3`);
      if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
      }
    }
  }
}
