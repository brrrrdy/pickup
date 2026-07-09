import type { ReactNode } from "react";
import { Text, type TextProps } from "react-native";

type FormLabelProps = TextProps & {
  children: ReactNode;
};

export default function FormLabel({
  children,
  className = "",
  ...props
}: FormLabelProps) {
  return (
    <Text
      className={`text-sm font-semibold uppercase tracking-wide text-defaulttext/85 ${className}`.trim()}
      {...props}
    >
      {children}
    </Text>
  );
}
