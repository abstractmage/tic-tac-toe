import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';

export type PanelProps = {
  classNames?: {
    main?: string;
    wrapper?: string;
    inner?: string;
  };
  shown?: boolean;
  onShowingEnd?: (showing: boolean) => void;
  direction?: 'left' | 'right';
  children?: React.ReactNode;
};

export const Panel: React.FC<PanelProps> = (props) => {
  const { shown, onShowingEnd, children, direction = 'right', classNames } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  const handleEnter = React.useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    if (ref.current) ref.current.offsetHeight;
  }, []);

  const handleEntered = React.useCallback(() => {
    if (onShowingEnd) onShowingEnd(true);
  }, [onShowingEnd]);

  const handleExited = React.useCallback(() => {
    if (onShowingEnd) onShowingEnd(false);
  }, [onShowingEnd]);

  return (
    <Transition
      in={shown}
      nodeRef={ref}
      timeout={500}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onExited={handleExited}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, classNames?.main)}>
          <div
            className={cn(
              style.wrapper,
              style[`wrapper_${state}`],
              style[`wrapper_direction_${direction}`],
              classNames?.wrapper,
            )}
          >
            <div className={cn(style.inner, classNames?.inner)}>{children}</div>
          </div>
        </div>
      )}
    </Transition>
  );
};
