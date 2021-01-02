import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as CircleSVG } from './svg/Circle.svg';
import { ReactComponent as CrossSVG } from './svg/Cross.svg';

export type CellProps = {
  value?: null | 'x' | 'o';
  disabled?: boolean;
  onClick: () => void;
};

export const Cell = (props: CellProps) => {
  const { value, disabled, onClick } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  const handleEnter = React.useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    if (ref.current) ref.current.offsetHeight;
  }, []);

  const handleClick = React.useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <Transition nodeRef={ref} in={value !== null} timeout={200} onEnter={handleEnter}>
      {(state) => (
        <div
          ref={ref}
          className={cn(style.main, style[`main_${state}`], !disabled && style.main_clickable)}
          onClick={handleClick}
        >
          {value === 'o' && <CircleSVG />}
          {value === 'x' && <CrossSVG />}
        </div>
      )}
    </Transition>
  );
};
