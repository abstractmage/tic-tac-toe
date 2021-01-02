import { ClientEvent } from '~/types/ClientEvents';
import { ServerEvent } from '~/types/ServerEvents';

export class WebSocketManager {
  ws: WebSocket;

  constructor(onMessage: (event: ServerEvent) => void) {
    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  }

  send(event: ClientEvent) {
    this.ws.send(JSON.stringify(event));
  }

  sendSetNicknameEvent(nickname: string) {
    this.send({ type: 'set-nickname', nickname });
  }

  sendCreateRoomEvent() {
    this.send({ type: 'create-room' });
  }

  sendJoinRoomEvent(roomId: string) {
    this.send({ type: 'join-room', roomId });
  }

  sendPlayerReadyEvent() {
    this.send({ type: 'player-ready' });
  }

  sendPlayerMoveEvent(cell: number) {
    this.send({ type: 'player-move', cell });
  }

  sendPlayerLeaveEvent() {
    this.send({ type: 'player-leave' });
  }
}
