import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import actionButtonsContent from "../../content/actionbuttons.json";
import { useAuth } from "../../lib/auth/AuthProvider";
import { useThemeColor } from "../../lib/theme/use-theme-color";

type LoginOrRegisterButtonProps = {
  href?: string;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
};

const PERSON_ICON_PATH =
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";

export default function LoginOrRegisterButton({
  href = "/login",
  className = "",
  textClassName = "text-base font-medium font-sans text-defaulttext",
  onPress,
}: LoginOrRegisterButtonProps) {
  const iconColor = useThemeColor("defaulttext");
  const { session, profile, signOut } = useAuth();
  const content = actionButtonsContent.en;

  const icon = (
    <Svg width={28} height={28} viewBox="0 0 24 24">
      <Path d={PERSON_ICON_PATH} fill={iconColor} />
    </Svg>
  );

  if (session) {
    const label = profile
      ? `${content.logOut} (${profile.display_name})`
      : content.logOut;

    return (
      <Pressable
        className={`flex-row items-center gap-1 ${className}`.trim()}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => {
          onPress?.();
          signOut();
        }}
      >
        <Text className={textClassName}>{label}</Text>
        {icon}
      </Pressable>
    );
  }

  return (
    <Link href={href} asChild>
      <Pressable
        className={`flex-row items-center gap-1 ${className}`.trim()}
        accessibilityRole="link"
        accessibilityLabel={`go to ${content.loginOrRegister}`}
        onPress={onPress}
      >
        <Text className={textClassName}>{content.loginOrRegister}</Text>
        {icon}
      </Pressable>
    </Link>
  );
}
