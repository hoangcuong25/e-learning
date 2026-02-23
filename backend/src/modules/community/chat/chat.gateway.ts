import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { SocketAuthMiddleware } from "../../auth/middleware/ws-auth.middleware";
import { Message } from "@prisma/client";

interface AuthenticatedSocket extends Socket {
  user: {
    email: string;
    id: number; // I will ensure id is attached in middleware or here
  };
}

@WebSocketGateway({
  namespace: "chat",
  cors: { origin: "*", credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.jwtService));
  }

  handleConnection(client: AuthenticatedSocket) {
    if (!client.user || !client.user.email) {
      client.disconnect(true);
      return;
    }

    const email = client.user.email;
    client.join(`chat-${email}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {}

  emitMessageToUser(receiverEmail: string, message: any) {
    this.server.to(`chat-${receiverEmail}`).emit("newMessage", message);
  }

  emitNewConversation(receiverEmail: string, conversation: any) {
    this.server
      .to(`chat-${receiverEmail}`)
      .emit("newConversation", conversation);
  }

  @SubscribeMessage("typing")
  handleTyping(
    @MessageBody()
    data: { conversationId: number; receiverEmail: string; isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    this.server.to(`chat-${data.receiverEmail}`).emit("userTyping", {
      conversationId: data.conversationId,
      senderEmail: client.user.email,
      isTyping: data.isTyping,
    });
  }
}
