// src/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ClientData {
  username: string;
  lastMessageTime: number;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, ClientData>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.clients.get(client.id);
    if (user) {
      this.server.emit('systemMessage', `${user.username} left the chat`);
    }
    this.clients.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() username: string, @ConnectedSocket() client: Socket) {
    if (!username || typeof username !== 'string') {
      throw new WsException('Invalid username');
    }

    this.clients.set(client.id, { username, lastMessageTime: 0 });
    this.server.emit('systemMessage', `${username} joined the chat`);

    // Send updated user list
    const userList = Array.from(this.clients.values()).map(u => u.username);
    this.server.emit('userList', userList);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.clients.get(client.id);
    if (!user) {
      throw new WsException('User not registered');
    }

    const now = Date.now();
    if (now - user.lastMessageTime < 1000) {
      throw new WsException('You are sending messages too quickly.');
    }

    if (!payload.message || typeof payload.message !== 'string') {
      throw new WsException('Message cannot be empty');
    }

    user.lastMessageTime = now;
    const time = new Date().toLocaleTimeString();

    this.server.emit('receiveMessage', {
      sender: user.username,
      message: payload.message,
      time,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket) {
    const user = this.clients.get(client.id);
    if (user) {
      client.broadcast.emit('typing', `${user.username} is typing...`);
    }
  }
}
