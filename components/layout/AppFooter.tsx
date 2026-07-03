import { Link } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import GitHubIcon from "../../assets/github-original.svg";
import LinkedInIcon from "../../assets/linkedin.svg";

const siteLinks = [
  { href: "/", label: "home" },
  { href: "/find-game", label: "find a game" },
  { href: "/start-game", label: "start a game" },
  { href: "/profile", label: "profile" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
  { href: "/register", label: "register" },
] as const;

const socialLinks = [
  {
    href: "https://github.com/brrrrdy/pickup",
    label: "github",
    Icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/tom-alvarez-ryan-80423951/",
    label: "linkedin",
    Icon: LinkedInIcon,
  },
] as const;

export default function AppFooter() {
  const year = new Date().getFullYear();

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="w-full gap-5">
      <View className="flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {siteLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Text className="text-sm text-defaulttext/75">{link.label}</Text>
          </Link>
        ))}
      </View>

      <View className="flex-row flex-wrap items-center justify-center gap-3">
        <Text className="text-center text-xs text-defaulttext/50">
          © {year} tom alvarez. all rights reserved.
        </Text>

        {socialLinks.map(({ href, label, Icon }) => (
          <Pressable
            key={label}
            onPress={() => openExternalLink(href)}
            accessibilityRole="link"
            accessibilityLabel={`open ${label}`}
            hitSlop={10}
          >
            <Icon width={28} height={28} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
