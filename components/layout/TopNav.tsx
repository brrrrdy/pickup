import { Link, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import topNavContent from "../../content/topnav.json";
import LoginOrRegisterButton from "../buttons/LoginOrRegisterButton";
import Logo from "../common/Logo";
import NavMenuDrawer, { type NavLink } from "./NavMenuDrawer";

const content = topNavContent.en;

const navLinks: readonly NavLink[] = content.navLinks.map((link) => ({
  href: link.href as NavLink["href"],
  label: link.label,
}));

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
        <View className="flex-1 items-start">
          {showNavLogo ? (
            <Link href="/" asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={content.accessibility.homeLink}
              >
                <Logo width={120} height={36} />
              </Pressable>
            </Link>
          ) : (
            <View className="h-7 w-7" />
          )}
        </View>

        <View className="relative flex-row items-center gap-2">
          <LoginOrRegisterButton />

          <Pressable
            onPress={() => setIsMenuOpen((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={
              isMenuOpen
                ? content.accessibility.closeMenu
                : content.accessibility.openMenu
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
