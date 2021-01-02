import WebSocket from 'ws';

export type Player = {
  id: string;
  nickname: string | null;
  socket: WebSocket;
};
