import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { ApiTags } from '@nestjs/swagger';
import { NewRoomDto } from './dto/new-room.dto';
import { NewMessageWSDto } from './dto/new-messsage-ws.dto';

@ApiTags('Chat WebSocket')
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly roomService: RoomsService,
  ) {}
  /**
   * Client connects.
   * When connecting, the following occurs:
   * 1. Obtaining a token from the request and verifying it to obtain the user ID.
   * 2. Storing the user ID in the client object for later use.
   * 3. Obtaining a list of rooms the user is a member of and joining them.
   * 4. Joining the user's personal room to receive notifications.
   * 5. If any error occurs during this process, the client is disconnected.
   *
   * @param {Socket} client
   * @memberof ChatGateway
   */
  async handleConnection(client: Socket) {
    try {
      const { token } = client.handshake.query;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { id }: { id: string } =
        await this.authService.verifyAccessToken(token);

      if (!id) {
        throw new Error('Unauthorized');
      }

      client['userId'] = id;
      console.log(client);
      const roomsIds: string[] = await this.roomService.getAllRoomId(id);

      await client.join('u-personal-room_' + id);
      await client.join(roomsIds);

      console.log('New user connected.. : ', client.id);
    } catch (error) {
      client.disconnect(true);
      console.error('ERROR:', error);
    }
  }

  handleDisconnect(client: Socket): void {
    console.log('User disconnected', client.id);
  }

  @SubscribeMessage('message')
  async onMessage(client: Socket, data: NewMessageWSDto) {
    try {
      const saveMessage = await this.chatService.createMessageText({
        ...data,
        senderId: client['userId'],
      });
      this.server.to(data.roomId).emit('chat-message', data.text);
    } catch (error) {
      throw new WsException(error.message || 'Failed to send message');
    }
  }

  @SubscribeMessage('new-room')
  async onNewRoom(client: Socket, data: NewRoomDto) {
    this.server.to('u-personal-room_' + data.senderId).emit('new-room', data);
  }

  @SubscribeMessage('delete-message')
  async deleteMessage(client: Socket, data) {
    try {
      await this.chatService.deleteMessage(data.messageId);
      this.server
        .to(data.roomId)
        .emit('deleted-message', { messageId: data.messageId });
    } catch (error) {
      console.error(error.message);
    }
  }

  @SubscribeMessage('get-messages')
  async getMessagesFromRoom(client: Socket, data) {
    try {
      const result = await this.chatService.getAllMessagesFromRoom({
        ...data,
        senderId: client['userId'],
      });
      this.server.to(data.roomId).emit('messages-room', result);
    } catch (error) {
      console.error(error.message);
    }
  }
}
