import { Image, View } from "react-native";
import { useUniwind } from "uniwind";

import PickupLogo from "../../assets/images/pickuplogo.webp";
import PickupLogoDark from "../../assets/images/pickuplogodark.webp";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 300, height = 100 }: LogoProps) {
  const { theme } = useUniwind();

  return (
    <View style={{ width, height }}>
      <Image
        source={theme === "dark" ? PickupLogoDark : PickupLogo}
        resizeMode="contain"
        accessibilityLabel="Pickup logo"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
