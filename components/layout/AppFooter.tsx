import { Linking, Pressable, Text, View } from "react-native";
import appFooterContent from "../../content/appfooter.json";
import GitHubIcon from "../../assets/github-original.svg";
import LinkedInIcon from "../../assets/linkedin.svg";

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
} as const;

export default function AppFooter() {
  const year = new Date().getFullYear();
  const content = appFooterContent.en;
  const socialLinks = (content.socialLinks ?? [])
    .map((link) => {
      const Icon = socialIcons[link.label as keyof typeof socialIcons];

      if (!Icon) {
        return null;
      }

      return {
        href: link.href,
        label: link.label,
        Icon,
      };
    })
    .filter((link) => link !== null);

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const noop = () => {};

  return (
    <View className="w-full self-center max-w-3xl gap-8">
      <View className="self-start flex-row flex-wrap justify-start gap-x-8 gap-y-6">
        {content.linkGroups.map((group) => (
          <View key={group.heading} className="min-w-35 flex-1 gap-3">
            <Text className="text-base font-semibold uppercase tracking-wide text-defaulttext">
              {group.heading}
            </Text>

            <View className="gap-2">
              {group.links.map((label) => (
                <Pressable
                  key={label}
                  onPress={noop}
                  accessibilityRole="link"
                  accessibilityLabel={label}
                  hitSlop={8}
                >
                  <Text className="text-sm text-defaulttext/75">{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View className="self-start items-start gap-4">
        <Text className="text-base font-semibold uppercase tracking-wide text-defaulttext">
          {content.followHeading}
        </Text>

        <View className="flex-row items-center justify-start gap-4">
          {socialLinks.map(({ href, label, Icon }) => (
            <Pressable
              key={label}
              onPress={() => openExternalLink(href)}
              accessibilityRole="link"
              accessibilityLabel={`${content.socialAccessibilityLabelPrefix} ${label}`}
              hitSlop={10}
            >
              <Icon width={28} height={28} />
            </Pressable>
          ))}
        </View>

        <Text className="text-left text-sm text-defaulttext/50">
          © {year} {content.copyrightSuffix}
        </Text>
      </View>
    </View>
  );
}
