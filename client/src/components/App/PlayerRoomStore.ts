import { makeAutoObservable } from 'mobx';
import { Player } from '~/types/Player';
import { Room } from '~/types/Room';

type FieldCell = 'x' | 'o' | null;

type Field = [
  FieldCell,
  FieldCell,
  FieldCell,
  FieldCell,
  FieldCell,
  FieldCell,
  FieldCell,
  FieldCell,
  FieldCell,
];

export class PlayerRoomStore {
  room: Room | null = null;

  player: Player | null = null;

  get player1() {
    if (this.player && this.room) {
      const { player } = this;
      const player1 = this.room.players.find((p) => p.id === player.id);

      return player1 || null;
    }

    return null;
  }

  get player2() {
    if (this.player && this.room) {
      const { player } = this;
      const player2 = this.room.players.find((p) => p.id !== player.id);

      return player2 || null;
    }

    return null;
  }

  get field(): Field {
    if (this.room) {
      return this.room.field;
    }

    return [null, null, null, null, null, null, null, null, null];
  }

  get selected() {
    if (this.room && this.room.state.type === 'wait-move') {
      return this.player1?.id === this.room.state.player ? 1 : 2;
    }

    return null;
  }

  get disabled() {
    if (this.room === null || this.room.state.type !== 'wait-move' || this.player1 === null)
      return true;

    return this.room.state.player !== this.player1.id;
  }

  get roomId() {
    return this.room?.id;
  }

  get readyPopupShown() {
    if (this.room === null || this.player1 === null) {
      return false;
    }

    return this.player1.state === 'init';
  }

  get readyPopupResult() {
    const { room } = this;

    if (room === null || room.result === undefined) {
      return undefined;
    }

    if (room.result.winner === null) return { winner: null };

    const { result } = room;

    return { winner: room.players.find((p) => p.id === result.winner)!.nickname! };
  }

  constructor() {
    makeAutoObservable(this);
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  setRoom(room: Room) {
    this.room = room;
  }
}
