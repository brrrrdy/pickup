import { View } from "react-native";
import Svg, { Defs, LinearGradient, Mask, Rect, Stop } from "react-native-svg";

import SplashLogo from "../../assets/splashlogo.svg";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 300, height = 180 }: LogoProps) {
  const gradientColors = ["#1317d4", "#0ea5e9", "#75073d"] as const;

  return (
    <View style={{ width, height }}>
      <Svg width="100%" height="100%" viewBox="0 0 1640 700">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="50%" stopColor={gradientColors[1]} />
            <Stop offset="100%" stopColor={gradientColors[2]} />
          </LinearGradient>
          <Mask
            id="logoMask"
            x="0"
            y="0"
            width="1640"
            height="700"
            maskUnits="userSpaceOnUse"
          >
            <Rect x="0" y="0" width="1640" height="700" fill="black" />
            <SplashLogo width="1640" height="700" />
          </Mask>
        </Defs>

        <Rect
          x="0"
          y="0"
          width="1640"
          height="700"
          fill="url(#logoGradient)"
          mask="url(#logoMask)"
        />
      </Svg>
    </View>
  );
}
