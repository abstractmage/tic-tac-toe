/* eslint-disable no-restricted-syntax */
import { Field } from '~/types/Field';

const winCombs = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const calcResult = (field: Field) => {
  for (const comb of winCombs) {
    if (field[comb[0]] !== null && comb.every((cell) => field[cell] === field[comb[0]])) {
      return field[comb[0]];
    }
  }

  return null;
};
