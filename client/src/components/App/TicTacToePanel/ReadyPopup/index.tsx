import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { Button } from '~/components/Button';

export type ReadyPopupProps = {
  shown?: boolean;
  result?: { winner: string | null };
  onReadyClick?: () => void;
  onExitClick?: () => void;
};

export const ReadyPopup = (props: ReadyPopupProps) => {
  const { shown, result, onExitClick, onReadyClick } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  const handleEnter = React.useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    if (ref.current) ref.current.offsetHeight;
  }, []);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={handleEnter}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          <div className={style.overlay} />
          <div className={style.inner}>
            {result && result.winner && <div className={style.result}>Winner: {result.winner}</div>}
            {result && result.winner === null && <div className={style.result}>Draw</div>}
            <Button classNames={{ main: style.button }} onClick={onReadyClick}>
              Ready
            </Button>
            <Button classNames={{ main: style.button }} onClick={onExitClick}>
              Exit
            </Button>
          </div>
        </div>
      )}
    </Transition>
  );
};
