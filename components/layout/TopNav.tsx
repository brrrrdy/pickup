import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import Logo from "../common/Logo";
import NavMenuDrawer from "./NavMenuDrawer";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
  { href: "/profile", label: "profile" },
] as const;

export default function TopNav() {
  const pathname = usePathname();
  const showNavLogo = pathname !== "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <View className="relative z-50 w-full py-4" style={{ elevation: 20 }}>
      <View className="relative flex-row min-h-9 items-center justify-between">
        <View className="h-7 w-7" />

        {showNavLogo ? (
          <View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
          >
            <Logo width={120} height={36} />
          </View>
        ) : null}

        <View className="relative items-center justify-center">
          <Pressable
            onPress={() => setIsMenuOpen((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={
              isMenuOpen ? "close navigation menu" : "open navigation menu"
            }
          >
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
          </Pressable>
        </View>
      </View>

      <NavMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
        links={navLinks}
      />
    </View>
  );
}
