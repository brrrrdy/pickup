import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function TopNav() {
  const pathname = usePathname();

  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center gap-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <Text
                className={
                  isActive
                    ? "font-semibold text-defaulttext"
                    : "text-defaulttext/70"
                }
              >
                {link.label}
              </Text>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
