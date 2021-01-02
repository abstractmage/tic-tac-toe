import React from 'react';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Panel } from '~/components/Panel';
import style from './index.module.scss';

export type NicknameEnterPanelProps = {
  shown?: boolean;
  direction?: 'left' | 'right';
  disabled?: boolean;
  onShowingEnd?: (showing: boolean) => void;
  onEnterClick?: (nickname: string) => void;
};

export const NicknameEnterPanel = (props: NicknameEnterPanelProps) => {
  const { shown, direction = 'right', disabled, onShowingEnd, onEnterClick } = props;
  const [input, setInput] = React.useState('');
  const [exited, setExited] = React.useState(true);

  const handleClick = React.useCallback(() => {
    if (onEnterClick) onEnterClick(input || 'Player1');
  }, [input, onEnterClick]);

  const handleShowingEnd = React.useCallback(
    (showing: boolean) => {
      if (!showing) {
        setExited(true);
      }

      if (onShowingEnd) onShowingEnd(showing);
    },
    [onShowingEnd],
  );

  React.useEffect(() => {
    if (shown) {
      setExited(false);
    }
  }, [shown]);

  React.useEffect(() => {
    if (exited) setInput('');
  }, [exited]);

  return (
    <Panel
      classNames={{ main: style.main }}
      shown={shown}
      direction={direction}
      onShowingEnd={handleShowingEnd}
    >
      <div className={style.label}>Enter you nickname</div>
      <Input
        classNames={{ main: style.input }}
        disabled={disabled}
        value={input}
        onChange={setInput}
      />
      <Button classNames={{ main: style.button }} disabled={disabled} onClick={handleClick}>
        Enter
      </Button>
    </Panel>
  );
};
