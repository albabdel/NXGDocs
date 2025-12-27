import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Icon/Arrow';

export default function IconArrow({className, ...restProps}: Props): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      className={clsx('icon-arrow', className)}
      {...restProps}>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
