import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsObject,
} from "class-validator";
import { MessageType } from "@prisma/client";

export class CreateMessageDto {
  @IsInt()
  @IsOptional()
  receiverId?: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @IsOptional()
  @IsArray()
  media?: { url: string; type: "IMAGE" | "VIDEO" }[];

  @IsOptional()
  @IsBoolean()
  isAiResponse?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: any;
}
