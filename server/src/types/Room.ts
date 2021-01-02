import { RoomPlayer } from './RoomPlayer';
import { Field } from './Field';

export type Room = {
  id: string;
  players: RoomPlayer[];
  field: Field;
  result?: { winner: string | null };
  state:
    | {
        type: 'wait-move';
        player: string;
      }
    | {
        type: 'wait-players';
      }
    | {
        type: 'wait-ready';
      };
};
