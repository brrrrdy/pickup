import { type ReactNode } from "react";
import { type StyleProp, type ViewStyle, View } from "react-native";

type PageContentProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export default function PageContent({
  children,
  className = "",
  style,
}: PageContentProps) {
  return (
    <View
      className={`w-full self-center max-w-3xl ${className}`.trim()}
      style={style}
    >
      {children}
    </View>
  );
}
