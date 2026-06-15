import { Text, type TextProps } from "react-native";

type TypographyProps = TextProps & {
  children: string;
};

export function PageHeader({ children, ...props }: TypographyProps) {
  return (
    <Text className="text-4xl font-bold text-defaulttext" {...props}>
      {children}
    </Text>
  );
}

export function PageBody({ children, ...props }: TypographyProps) {
  return (
    <Text className="text-base text-defaulttext/100" {...props}>
      {children}
    </Text>
  );
}