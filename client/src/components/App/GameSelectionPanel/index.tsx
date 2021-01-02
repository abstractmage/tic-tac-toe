import React from 'react';
import { Button } from '~/components/Button';
import { Panel } from '~/components/Panel';
import style from './index.module.scss';

export type GameSelectionPanelProps = {
  shown?: boolean;
  direction?: 'left' | 'right';
  disabled?: boolean;
  onShowingEnd?: (showing: boolean) => void;
  onPlayerButtonClick?: () => void;
  onComputerButtonClick?: () => void;
};

export const GameSelectionPanel = (props: GameSelectionPanelProps) => {
  const {
    shown,
    direction = 'right',
    disabled,
    onShowingEnd,
    onPlayerButtonClick,
    onComputerButtonClick,
  } = props;

  return (
    <Panel
      classNames={{ main: style.main }}
      shown={shown}
      direction={direction}
      onShowingEnd={onShowingEnd}
    >
      <div className={style.text}>Tic-tac-toe</div>
      <Button classNames={{ main: style.button }} disabled={disabled} onClick={onPlayerButtonClick}>
        Player vs Player
      </Button>
      <Button
        classNames={{ main: style.button }}
        disabled={disabled}
        onClick={onComputerButtonClick}
      >
        Player vs Computer
      </Button>
    </Panel>
  );
};
