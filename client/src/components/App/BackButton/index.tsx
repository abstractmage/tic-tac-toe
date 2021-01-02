import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as ArrowLeftSVG } from './svg/ArrowLeft.svg';

export type BackButtonProps = {
  shown?: boolean;
  onClick?: () => void;
};

export const BackButton = (props: BackButtonProps) => {
  const { shown, onClick } = props;

  const handleClick = React.useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <div
      className={cn(style.main, shown && style.main_shown, onClick && style.main_clickable)}
      onClick={handleClick}
    >
      <div className={style.inner}>
        <ArrowLeftSVG />
      </div>
    </div>
  );
};
