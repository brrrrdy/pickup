import { Image, View } from "react-native";

import PickupLogo from "../../assets/pickuplogo.webp";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 300, height = 180 }: LogoProps) {
  return (
    <View style={{ width, height }}>
      <Image
        source={PickupLogo}
        resizeMode="contain"
        accessibilityLabel="Pickup logo"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
