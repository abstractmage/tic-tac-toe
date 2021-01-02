/* eslint-disable no-param-reassign */
import WebSocket from 'ws';
import http from 'http';
import { v4 as uuid } from 'uuid';
import { Room } from './types/Room';
import { Player } from './types/Player';
import {
  ClientEvent,
  JoinRoomEvent,
  PlayerMoveEvent,
  SetNicknameEvent,
} from './types/ClientEvents';
import { ConnectedEvent, RoomStateChangedEvent } from './types/ServerEvents';
import { RoomPlayer } from './types/RoomPlayer';
import { calcResult } from './helpers/calcResult';

/**
 * { "type": "set-nickname", "nickname": "Player 1" }
 * { "type": "create-room" }
 * { "type": "join-room", "roomId": "123" }
 * { "type": "player-ready" }
 * { "type": "player-move", "cell": 0 }
 */

export class RoomManager {
  ws: WebSocket.Server;

  rooms: Room[] = [];

  players: Player[] = [];

  constructor(server: http.Server) {
    this.ws = new WebSocket.Server({ server });
    this.ws.on('connection', this.listen);
  }

  static create(server: http.Server) {
    return new RoomManager(server);
  }

  private listen = (socket: WebSocket) => {
    const player = this.createPlayer(socket);
    const connectedEvent: ConnectedEvent = { type: 'connected', id: player.id };

    player.socket.send(JSON.stringify(connectedEvent));
    player.socket
      .on('message', (data) => this.handleMessage(player, data))
      .on('close', () => this.handleClose(player));
  };

  createPlayer(socket: WebSocket) {
    const player: Player = { id: uuid(), nickname: null, socket };
    this.players.push(player);
    return player;
  }

  createRoom() {
    const room: Room = {
      id: uuid(),
      players: [],
      field: [null, null, null, null, null, null, null, null, null],
      state: {
        type: 'wait-players',
      },
    };

    this.rooms.push(room);

    return room;
  }

  handleMessage = (player: Player, message: WebSocket.Data) => {
    if (typeof message !== 'string') return;

    const event: ClientEvent = JSON.parse(message);

    if (event.type === 'set-nickname') this.handleSetNicknameEvent(player, event);
    if (event.type === 'create-room') this.handleCreateRoomEvent(player);
    if (event.type === 'player-leave') this.handlePlayerLeaveEvent(player);
    if (event.type === 'join-room') this.handleJoinRoomEvent(player, event);
    if (event.type === 'player-ready') this.handlePlayerReadyEvent(player);
    if (event.type === 'player-move') this.handlePlayerMoveEvent(player, event);
  };

  handleSetNicknameEvent = (player: Player, event: SetNicknameEvent) => {
    const room = this.getRoomByPlayerId(player.id);

    if (room) return;

    player.nickname = event.nickname;
  };

  handleCreateRoomEvent = (player: Player) => {
    const room = this.getRoomByPlayerId(player.id);

    if (room) return;

    const newRoom = this.createRoom();
    const randomSign = ['x', 'o'][Math.floor(Math.random() * 2)] as 'x' | 'o';
    const roomPlayer: RoomPlayer = { ...player, sign: randomSign, score: 0, state: 'init' };
    newRoom.players = [roomPlayer];
    newRoom.state = { type: 'wait-players' };
    this.sendRoomCreatedEvent(player);
    this.sendRoomStateChangedEvent(newRoom);
  };

  handlePlayerLeaveEvent = (player: Player) => {
    const room = this.getRoomByPlayerId(player.id);

    if (!room) return;

    this.removePlayerFromRoom(room.id, player.id);

    if (room.players.length === 0) {
      this.removeRoom(room.id);
    } else {
      room.state = { type: 'wait-players' };
      this.sendRoomStateChangedEvent(room);
    }
  };

  handleJoinRoomEvent = (player: Player, event: JoinRoomEvent) => {
    const room = this.getRoomByPlayerId(player.id);

    if (room) return;

    const foundRoom = this.getRoomById(event.roomId);

    if (!foundRoom || foundRoom.players.length !== 1) return;

    const sign = foundRoom.players[0].sign === 'x' ? 'o' : 'x';
    const roomPlayer: RoomPlayer = { ...player, sign, score: 0, state: 'init' };
    foundRoom.players = foundRoom.players.concat(roomPlayer);
    foundRoom.state = { type: 'wait-ready' };
    this.sendJoinRoomSuccessEvent(player);
    this.sendRoomStateChangedEvent(foundRoom);
  };

  handlePlayerReadyEvent = (player: Player) => {
    const room = this.getRoomByPlayerId(player.id);
    const roomPlayer = this.getRoomPlayerByPlayerId(player.id);

    if (!roomPlayer || !room) return;

    if (room.state.type === 'wait-players') {
      roomPlayer.state = 'ready';
      this.sendRoomStateChangedEvent(room);
      return;
    }

    if (room.state.type !== 'wait-ready') {
      return;
    }

    roomPlayer.state = 'ready';

    const everyRoomPlayerIsReady = room.players.every((p) => p.state === 'ready');

    if (everyRoomPlayerIsReady) {
      const movePlayer = room.players[Math.floor(Math.random() * 2)];
      room.state = { type: 'wait-move', player: movePlayer.id };
      room.field = [null, null, null, null, null, null, null, null, null];
      room.result = undefined;
      room.players.forEach((p) => {
        p.state = 'playing';
      });
      this.sendRoomStateChangedEvent(room);
    } else {
      room.state = { type: 'wait-ready' };
      this.sendRoomStateChangedEvent(room);
    }
  };

  handlePlayerMoveEvent = (player: Player, event: PlayerMoveEvent) => {
    const room = this.getRoomByPlayerId(player.id);
    const roomPlayer = this.getRoomPlayerByPlayerId(player.id);
    const otherRoomPlayer = this.getOtherRoomPlayerByPlayerId(player.id);

    if (
      !room ||
      !roomPlayer ||
      !otherRoomPlayer ||
      room.state.type !== 'wait-move' ||
      room.state.player !== player.id ||
      room.field[event.cell] !== null
    )
      return;

    room.field[event.cell] = roomPlayer.sign;
    room.state.player = otherRoomPlayer.id;

    const winnerSign = calcResult(room.field);
    const noEmptyCells = room.field.every((c) => c !== null);

    if (winnerSign) {
      const winnerPlayer = this.getRoomPlayerByRoomIdAndSign(room.id, winnerSign)!;
      winnerPlayer.score += 1;
      room.players.forEach((p) => {
        p.state = 'init';
      });
      room.result = { winner: winnerPlayer.id };
      room.state = {
        type: 'wait-ready',
      };
    } else if (noEmptyCells) {
      room.players.forEach((p) => {
        p.state = 'init';
      });
      room.result = { winner: null };
      room.state = {
        type: 'wait-ready',
      };
    }

    this.sendRoomStateChangedEvent(room);
  };

  handleClose = (player: Player) => {
    const room = this.getRoomByPlayerId(player.id);

    this.removePlayer(player.id);

    if (room) {
      this.removePlayerFromRoom(room.id, player.id);
      room.state = { type: 'wait-players' };
    }

    if (room && room.players.length === 0) {
      this.removeRoom(room.id);
    }

    if (room) {
      this.sendRoomStateChangedEvent(room);
    }
  };

  getRoomById = (roomId: string) => {
    return this.rooms.find((r) => r.id === roomId);
  };

  getRoomByPlayerId = (playerId: string) => {
    return this.rooms.find((r) => r.players.find((p) => p.id === playerId));
  };

  getRoomPlayerByPlayerId = (playerId: string) => {
    const roomPlayers = this.rooms.map((r) => r.players).flat();
    return roomPlayers.find((p) => p.id === playerId);
  };

  getOtherRoomPlayerByPlayerId = (playerId: string) => {
    const roomPlayers = this.rooms.map((r) => r.players).flat();
    return roomPlayers.find((p) => p.id !== playerId);
  };

  getRoomPlayerByRoomIdAndSign = (roomId: string, sign: 'x' | 'o') => {
    const room = this.getRoomById(roomId);

    if (!room) return null;

    return room.players.find((p) => p.sign === sign);
  };

  removePlayer = (playerId: string) => {
    this.players = this.players.filter((p) => p.id !== playerId);
  };

  removePlayerFromRoom = (roomId: string, playerId: string) => {
    const room = this.rooms.find((r) => r.id === roomId);

    if (!room) return;

    room.players = room.players.filter((p) => p.id !== playerId);
  };

  removeRoom = (roomId: string) => {
    this.rooms = this.rooms.filter((r) => r.id !== roomId);
  };

  sendRoomStateChangedEvent = (room: Room) => {
    const data: RoomStateChangedEvent = {
      type: 'room-state-changed',
      room: {
        ...room,
        players: room.players.map((p) => ({ ...p, socket: undefined })),
      },
    };
    room.players.forEach((p) => {
      p.socket.send(JSON.stringify(data));
    });
  };

  sendJoinRoomSuccessEvent = (player: Player) => {
    player.socket.send(JSON.stringify({ type: 'join-room-success' }));
  };

  sendRoomCreatedEvent = (player: Player) => {
    player.socket.send(JSON.stringify({ type: 'room-created' }));
  };
}
