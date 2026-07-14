import { Image, type ImageSourcePropType, View } from "react-native";
import PlaceholderBanner from "../../assets/images/placeholderbanner.webp";

type HeroBannerProps = {
  imageSource?: ImageSourcePropType;
  accessibilityLabel?: string;
  resizeMode?: "cover" | "contain";
};

export default function HeroBanner({
  imageSource = PlaceholderBanner,
  accessibilityLabel = "Hero banner",
  resizeMode = "contain",
}: HeroBannerProps) {
  return (
    <View className="w-full" style={{ aspectRatio: 1363 / 780 }}>
      <Image
        source={imageSource}
        resizeMode={resizeMode}
        accessibilityLabel={accessibilityLabel}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
