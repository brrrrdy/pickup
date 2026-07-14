import { Link } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import appFooterContent from "../../content/appfooter.json";
import GitHubIcon from "../../assets/images/github-original.svg";
import LinkedInIcon from "../../assets/images/linkedin.svg";

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

  const isManifestoLabel = (label: string) => {
    const normalized = label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return normalized === "manifesto" || normalized === "manifiesto";
  };

  const isTermsOrPrivacyLabel = (label: string) => {
    const normalized = label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return (
      normalized.includes("privacy") ||
      normalized.includes("privacidad") ||
      normalized.includes("privacidade") ||
      normalized.includes("terms") ||
      normalized.includes("terminos") ||
      normalized.includes("termos") ||
      normalized === "ts and cs"
    );
  };

  const noop = () => {};

  return (
    <View className="w-full self-center max-w-3xl items-center gap-8">
      <View className="w-full flex-row flex-wrap justify-center gap-x-8 gap-y-6">
        {content.linkGroups.map((group) => (
          <View
            key={group.heading}
            className="min-w-35 flex-1 items-center gap-3"
          >
            <Text className="text-base font-semibold font-sans uppercase tracking-wide text-defaulttext">
              {group.heading}
            </Text>

            <View className="items-center gap-2">
              {group.links.map((label) =>
                isManifestoLabel(label) ? (
                  <Link key={label} href="/manifesto" asChild>
                    <Pressable
                      accessibilityRole="link"
                      accessibilityLabel={label}
                      hitSlop={8}
                    >
                      <Text className="text-sm font-sans text-defaulttext/75">
                        {label}
                      </Text>
                    </Pressable>
                  </Link>
                ) : isTermsOrPrivacyLabel(label) ? (
                  <Link key={label} href="/terms-and-privacy" asChild>
                    <Pressable
                      accessibilityRole="link"
                      accessibilityLabel={label}
                      hitSlop={8}
                    >
                      <Text className="text-sm font-sans text-defaulttext/75">
                        {label}
                      </Text>
                    </Pressable>
                  </Link>
                ) : (
                  <Pressable
                    key={label}
                    onPress={noop}
                    accessibilityRole="link"
                    accessibilityLabel={label}
                    hitSlop={8}
                  >
                    <Text className="text-sm font-sans text-defaulttext/75">
                      {label}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>
        ))}
      </View>

      <View className="items-center gap-4">
        <Text className="text-base font-sans font-semibold uppercase tracking-wide text-defaulttext">
          {content.followHeading}
        </Text>

        <View className="flex-row items-center justify-center gap-4">
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

        <Text className="text-center text-sm font-sans text-defaulttext/50">
          © {year} {content.copyrightSuffix}
        </Text>
      </View>
    </View>
  );
}
