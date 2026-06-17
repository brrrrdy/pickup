import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import Logo from "../common/Logo";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

export default function TopNav() {
  const pathname = usePathname();
  const showNavLogo = pathname !== "/";

  return (
    <View className="w-full py-4">
      <View className="flex-row min-h-9 items-center justify-between">
        <View className="flex-row items-center gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Text
                  className={isActive ? "font-semibold text-base" : "text-base"}
                >
                  {link.label}
                </Text>
              </Link>
            );
          })}
        </View>
        {showNavLogo ? <Logo width={120} height={36} /> : null}
        <View className="items-center justify-center">
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Rect
              x="2"
              y="5"
              width="20"
              height="2"
              rx="1"
              fill="currentColor"
            />
            <Rect
              x="2"
              y="11"
              width="20"
              height="2"
              rx="1"
              fill="currentColor"
            />
            <Rect
              x="2"
              y="17"
              width="20"
              height="2"
              rx="1"
              fill="currentColor"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
}
