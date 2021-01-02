import React from 'react';
import cn from 'classnames';
import { Panel } from '~/components/Panel';
import { Cell } from './Cell';
import style from './index.module.scss';
import { ReactComponent as CircleSVG } from './Cell/svg/Circle.svg';
import { ReactComponent as CrossSVG } from './Cell/svg/Cross.svg';
import { RoomPlayer } from '~/types/RoomPlayer';
import { ReadyPopup } from './ReadyPopup';

type FieldCell = 'x' | 'o' | null;

export type TicTacToePanelProps = {
  shown?: boolean;
  direction?: 'left' | 'right';
  disabled?: boolean;
  selected?: 1 | 2 | null;
  onShowingEnd?: (showing: boolean) => void;
  onCellClick?: (index: number) => void;
  roomId?: string;
  player1: RoomPlayer | null;
  player2: RoomPlayer | null;
  field: [
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
  readyPopupShown?: boolean;
  result?: { winner: string | null };
  onReadyClick?: () => void;
  onExitClick?: () => void;
};

export const TicTacToePanel = (props: TicTacToePanelProps) => {
  const {
    roomId,
    shown,
    direction,
    disabled,
    selected,
    onShowingEnd,
    onCellClick,
    player1,
    player2,
    field,
    readyPopupShown,
    result,
    onReadyClick,
    onExitClick,
  } = props;

  const createCellClickHandler = React.useCallback(
    (index: number) => {
      return () => {
        if (onCellClick) onCellClick(index);
      };
    },
    [onCellClick],
  );

  return (
    <Panel
      classNames={{ main: style.main, inner: style.panelInner }}
      shown={shown}
      direction={direction}
      onShowingEnd={onShowingEnd}
    >
      {player1 && player2 ? (
        <div className={style.score}>
          {player1.score} : {player2.score}
        </div>
      ) : (
        <div className={style.score}>- : -</div>
      )}
      <div className={style.head}>
        <div
          className={cn(
            style.headLeft,
            selected === 2 && style.headLeft_blur,
            selected === 1 && style.headLeft_lighted,
          )}
        >
          <div className={style.headLeftNickname}>{player1 ? player1.nickname : '—'}</div>
          {player1 && (
            <div className={style.headLeftSign}>
              <div className={style.headSign}>
                {player1.sign === 'o' && <CircleSVG />}
                {player1.sign === 'x' && <CrossSVG />}
              </div>
            </div>
          )}
        </div>
        <div
          className={cn(
            style.headRight,
            selected === 1 && style.headRight_blur,
            selected === 2 && style.headRight_lighted,
          )}
        >
          <div className={style.headRightNickname}>{player2 ? player2.nickname : '—'}</div>
          {player2 && (
            <div className={style.headRightSign}>
              <div className={style.headSign}>
                {player2.sign === 'o' && <CircleSVG />}
                {player2.sign === 'x' && <CrossSVG />}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={style.field}>
        {field.map((cell, i) => (
          <div key={i} className={style.cellWrapper}>
            <Cell value={cell} disabled={disabled} onClick={createCellClickHandler(i)} />
          </div>
        ))}
      </div>
      {roomId && <div className={style.roomId}>Room ID: {roomId}</div>}
      <ReadyPopup
        shown={readyPopupShown}
        result={result}
        onReadyClick={onReadyClick}
        onExitClick={onExitClick}
      />
    </Panel>
  );
};
