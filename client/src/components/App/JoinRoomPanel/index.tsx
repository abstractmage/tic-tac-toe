import React from 'react';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Panel } from '~/components/Panel';
import style from './index.module.scss';

export type JoinRoomPanelProps = {
  shown?: boolean;
  direction?: 'left' | 'right';
  disabled?: boolean;
  onShowingEnd?: (showing: boolean) => void;
  onEnterClick?: (roomID: string) => void;
};

export const JoinRoomPanel = (props: JoinRoomPanelProps) => {
  const { shown, direction, disabled, onShowingEnd, onEnterClick } = props;
  const [roomID, setRoomID] = React.useState('');

  const handleClick = React.useCallback(() => {
    if (onEnterClick) onEnterClick(roomID);
  }, [onEnterClick, roomID]);

  return (
    <Panel
      classNames={{ main: style.main }}
      shown={shown}
      direction={direction}
      onShowingEnd={onShowingEnd}
    >
      <div className={style.label}>Enter room ID</div>
      <Input
        classNames={{ main: style.input }}
        disabled={disabled}
        value={roomID}
        onChange={setRoomID}
      />
      <Button classNames={{ main: style.button }} disabled={disabled} onClick={handleClick}>
        Enter
      </Button>
    </Panel>
  );
};
