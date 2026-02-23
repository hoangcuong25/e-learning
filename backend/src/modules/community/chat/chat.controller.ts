import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ConversationQueryDto, MessageQueryDto } from "./dto/chat-query.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "src/core/decorator/customize";

@ApiTags("Community - Chat")
@ApiBearerAuth()
@Controller("community/chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("messages")
  @ApiOperation({ summary: "Send a message" })
  @ResponseMessage("Send message successfully")
  sendMessage(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    return this.chatService.sendMessage(req.user.id, createMessageDto);
  }

  @Post("conversations/find-or-create")
  @ApiOperation({ summary: "Find or create a conversation" })
  @ResponseMessage("Conversation retrieved successfully")
  findOrCreateConversation(
    @Body("targetUserId") targetUserId: number,
    @Req() req
  ) {
    return this.chatService.findOrCreateConversation(req.user.id, targetUserId);
  }

  @Get("conversations")
  @ApiOperation({ summary: "Get all conversations" })
  @ResponseMessage("Get conversations successfully")
  getConversations(@Query() query: ConversationQueryDto, @Req() req) {
    return this.chatService.getConversations(req.user.id, query);
  }

  @Get("conversations/:id/messages")
  @ApiOperation({ summary: "Get messages of a conversation" })
  @ResponseMessage("Get messages successfully")
  getMessages(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: MessageQueryDto,
    @Req() req
  ) {
    return this.chatService.getMessages(id, req.user.id, query);
  }

  @Patch("conversations/:id/read")
  @ApiOperation({ summary: "Mark conversation messages as read" })
  @ResponseMessage("Mark as read successfully")
  markAsRead(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.chatService.markAsRead(id, req.user.id);
  }

  @Delete("conversations/:id")
  @ApiOperation({ summary: "Hide/Delete a conversation" })
  @ResponseMessage("Hide conversation successfully")
  hideConversation(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.chatService.hideConversation(id, req.user.id);
  }

  @Get("conversations/ai")
  @ApiOperation({ summary: "Get or create conversation with AI Tutor" })
  @ResponseMessage("AI conversation retrieved successfully")
  getAiConversation(@Req() req) {
    return this.chatService.getAiConversation(req.user.id);
  }

  @Post("messages/ai")
  @ApiOperation({ summary: "Chat with AI Tutor" })
  @ResponseMessage("AI response generated successfully")
  chatWithAi(@Body("content") content: string, @Req() req) {
    return this.chatService.chatWithAi(req.user.id, content);
  }
}
