import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';

export type InputProps = {
  classNames?: {
    main?: string;
  };
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export const Input = (props: InputProps) => {
  const { classNames, disabled, value, onChange } = props;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const { value: val } = e.target;
      if (onChange) onChange(val);
    },
    [disabled, onChange],
  );

  return (
    <input
      className={cn(style.main, !disabled && style.main_clickable, classNames?.main)}
      type="text"
      value={value}
      onChange={handleChange}
    />
  );
};
