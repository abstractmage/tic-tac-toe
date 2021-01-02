export type SetNicknameEvent = {
  type: 'set-nickname';
  nickname: string;
};

export type CreateRoomEvent = {
  type: 'create-room';
};

export type JoinRoomEvent = {
  type: 'join-room';
  roomId: string;
};

export type PlayerReadyEvent = {
  type: 'player-ready';
};

export type PlayerMoveEvent = {
  type: 'player-move';
  cell: number;
};

export type PlayerLeaveEvent = {
  type: 'player-leave';
};

export type ClientEvent =
  | SetNicknameEvent
  | CreateRoomEvent
  | JoinRoomEvent
  | PlayerReadyEvent
  | PlayerMoveEvent
  | PlayerLeaveEvent;
