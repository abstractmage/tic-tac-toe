import { Room } from './Room';
import { RoomPlayer } from './RoomPlayer';

export type ConnectedEvent = {
  type: 'connected';
  id: string;
};

export type RoomCreatedEvent = {
  type: 'room-created';
};

export type JoinRoomSuccessEvent = {
  type: 'join-room-success';
};

export type RoomStateChangedEvent = {
  type: 'room-state-changed';
  room: Omit<Room, 'players'> & { players: Omit<RoomPlayer, 'socket'>[] };
};

export type ServerEvent =
  | RoomStateChangedEvent
  | ConnectedEvent
  | JoinRoomSuccessEvent
  | RoomCreatedEvent;
