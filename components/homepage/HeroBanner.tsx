import { Image, type ImageSourcePropType, View } from "react-native";

import PlaceholderBanner from "../../assets/placeholderbanner.webp";

type HeroBannerProps = {
  imageSource?: ImageSourcePropType;
  height?: number;
  accessibilityLabel?: string;
  resizeMode?: "cover" | "contain";
};

export default function HeroBanner({
  imageSource = PlaceholderBanner,
  height = 220,
  accessibilityLabel = "Hero banner",
  resizeMode = "contain",
}: HeroBannerProps) {
  return (
    <View
      style={{
        width: "100%",
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <Image
        source={imageSource}
        resizeMode={resizeMode}
        accessibilityLabel={accessibilityLabel}
        style={{ width: "100%", height, marginTop: 0, marginBottom: 0 }}
      />
    </View>
  );
}
