import React from 'react';
import { Button } from '~/components/Button';
import { Panel } from '~/components/Panel';
import style from './index.module.scss';

export type CreateOrJoinPanelProps = {
  shown?: boolean;
  direction?: 'left' | 'right';
  disabled?: boolean;
  onShowingEnd?: (showing: boolean) => void;
  onCreateRoomClick?: () => void;
  onJoinRoomClick?: () => void;
};

export const CreateOrJoinPanel = (props: CreateOrJoinPanelProps) => {
  const {
    shown,
    direction = 'right',
    disabled,
    onShowingEnd,
    onCreateRoomClick,
    onJoinRoomClick,
  } = props;

  return (
    <Panel
      classNames={{ main: style.main }}
      shown={shown}
      direction={direction}
      onShowingEnd={onShowingEnd}
    >
      <Button classNames={{ main: style.button }} disabled={disabled} onClick={onCreateRoomClick}>
        Create room
      </Button>
      <Button classNames={{ main: style.button }} disabled={disabled} onClick={onJoinRoomClick}>
        Join room
      </Button>
    </Panel>
  );
};
