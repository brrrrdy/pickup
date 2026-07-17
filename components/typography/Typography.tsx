import type { ReactNode } from "react";
import { Text, type TextProps } from "react-native";

type TypographyProps = TextProps & {
  children: ReactNode;
};

export function PageHeader({
  children,
  className = "",
  ...props
}: TypographyProps) {
  return (
    <Text
      className={`text-4xl font-bold font-display text-defaulttext pb-2 ${className}`.trim()}
      {...props}
    >
      {children}
    </Text>
  );
}

export function PageBody({
  children,
  className = "",
  ...props
}: TypographyProps) {
  return (
    <Text
      className={`text-base font-sans text-defaulttext ${className}`.trim()}
      {...props}
    >
      {children}
    </Text>
  );
}

export function PageSmall({
  children,
  className = "",
  ...props
}: TypographyProps) {
  return (
    <Text
      className={`text-sm font-sans text-defaulttext ${className}`.trim()}
      {...props}
    >
      {children}
    </Text>
  );
}
