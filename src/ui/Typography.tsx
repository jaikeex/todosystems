import React from 'react';
import cn from 'classnames';

const classConfig = {
  variant: {
    'heading-lg': 'text-2xl font-semibold',
    'heading-sm': 'text-lg font-semibold',
    'body': 'text-base',
    'label': 'text-sm font-semibold',
    'error': 'font-base text-red-700 dark:text-red-500'
  },

  align: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
};

type TypographyVariant =
  | 'heading-lg'
  | 'heading-sm'
  | 'body'
  | 'label'
  | 'error';

type TypographyOwnProps<E extends React.ElementType> = Readonly<{
  align?: 'left' | 'center' | 'right' | 'justify';
  as?: E;
  disableLinkStyles?: boolean;
  variant?: TypographyVariant;
}>;

export type TypographyProps<E extends React.ElementType> =
  TypographyOwnProps<E> &
    Omit<React.ComponentProps<E>, keyof TypographyOwnProps<E>>;

export const Typography = <E extends React.ElementType = 'p'>({
  align,
  as,
  children,
  className = '',
  disableLinkStyles = false,
  variant = 'body',
  ...props
}: TypographyProps<E>) => {
  const Component = as || 'p';

  return (
    <Component
      {...props}
      className={cn(
        `font-open-sans md:antialiased ${classConfig.variant[variant]} ${
          disableLinkStyles ? 'no-underline typography-base' : ''
        }`,
        align && classConfig.align[align],
        className
      )}
    >
      {children}
    </Component>
  );
};
