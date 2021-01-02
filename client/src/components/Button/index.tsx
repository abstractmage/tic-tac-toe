import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';

export type ButtonProps = {
  classNames?: {
    main?: string;
  };
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  const { classNames, disabled, onClick, children } = props;

  const handleClick = React.useCallback(() => {
    if (onClick && !disabled) onClick();
  }, [disabled, onClick]);

  return (
    <div
      className={cn(style.main, !disabled && style.main_clickable, classNames?.main)}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
