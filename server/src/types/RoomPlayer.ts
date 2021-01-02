import { Player } from './Player';

export type RoomPlayer = Player & {
  sign: 'x' | 'o';
  score: number;
  state: 'init' | 'ready' | 'playing';
};
