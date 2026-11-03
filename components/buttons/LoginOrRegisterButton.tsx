import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import actionButtonsContent from "../../content/actionbuttons.json";
import { useThemeColor } from "../../lib/theme/use-theme-color";

type LoginOrRegisterButtonProps = {
  href?: string;
  className?: string;
  textClassName?: string;
};

export default function LoginOrRegisterButton({
  href = "/login",
  className = "",
  textClassName = "text-base font-medium font-sans text-defaulttext",
}: LoginOrRegisterButtonProps) {
  const iconColor = useThemeColor("defaulttext");

  return (
    <Link href={href} asChild>
      <Pressable
        className={`flex-row items-center gap-1 ${className}`.trim()}
        accessibilityRole="link"
        accessibilityLabel={`go to ${actionButtonsContent.en.loginOrRegister}`}
      >
        <Text className={textClassName}>
          {actionButtonsContent.en.loginOrRegister}
        </Text>
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill={iconColor}
          />
        </Svg>
      </Pressable>
    </Link>
  );
}
