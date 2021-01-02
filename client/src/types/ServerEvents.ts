import { Room } from './Room';

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
  room: Room;
};

export type ServerEvent =
  | RoomStateChangedEvent
  | ConnectedEvent
  | JoinRoomSuccessEvent
  | RoomCreatedEvent;
