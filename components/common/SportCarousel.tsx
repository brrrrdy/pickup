import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { useUniwind } from "uniwind";
import { THEME_COLORS } from "../../lib/theme/colors";

type Slide = {
  key: string;
  source: ImageSourcePropType;
};

const SLIDES: readonly Slide[] = [
  { key: "soccer", source: require("../../assets/images/soccer.webp") },
  { key: "padel", source: require("../../assets/images/padel.webp") },
  { key: "tennis", source: require("../../assets/images/tennis.webp") },
  {
    key: "basketball",
    source: require("../../assets/images/basketball.webp"),
  },
];

const PAUSE_MS = 6000;
const SLIDE_MS = 650;
// Offsets (in slides) the track wobbles through after arriving.
const SHUDDER_STEPS = [0.035, -0.025, 0.012, -0.005, 0];
const SHUDDER_STEP_MS = 55;
const BLUR_RADIUS = 5;
// The centre image takes 85% of the width, leaving 7.5% on each side for the
// neighbouring images to peek in. On wide screens it stops growing at
// MAX_SLIDE_WIDTH, so more of the neighbours show.
const SLIDE_WIDTH_RATIO = 0.85;
const MAX_SLIDE_WIDTH = 760;
const IMAGE_ASPECT_RATIO = 1.5;
// The carousel bleeds out of the page padding (PageShell: px-4 + px-4).
const PAGE_GUTTER = 32;

type Stop = readonly [location: number, alpha: number];

// Turns left-half stops into stops for the full width, mirrored on the right.
function mirror(left: Stop[]): Stop[] {
  const right = [...left]
    .reverse()
    .map(([at, alpha]) => [1 - at, alpha] as const);
  return [...left, ...right];
}

// Edge treatment, as stops across the carousel width (0 = left, 1 = right),
// given the fraction of the width each peeking neighbour takes up: the
// outermost strip fades to nothing, and the peeking images go from blurred at
// the edge to sharp where they meet the centre image.
function edgeMasks(peek: number) {
  return {
    outerFade: mirror([
      [0, 0],
      [peek * 0.4, 1],
    ]),
    blur: mirror([
      [0, 1],
      [peek, 0],
    ]),
    sharp: mirror([
      [0, 0],
      [peek, 1],
    ]),
  };
}

// Shows its children through a horizontal alpha gradient.
function HorizontalMask({
  stops,
  children,
}: {
  stops: Stop[];
  children: ReactNode;
}) {
  if (Platform.OS === "web") {
    const gradient = stops
      .map(([at, alpha]) => `rgba(0,0,0,${alpha}) ${(at * 100).toFixed(2)}%`)
      .join(", ");
    const style = {
      maskImage: `linear-gradient(to right, ${gradient})`,
    } as ViewStyle;

    return <View style={[StyleSheet.absoluteFill, style]}>{children}</View>;
  }

  const colors = stops.map(([, alpha]) => `rgba(0,0,0,${alpha})`);
  const locations = stops.map(([at]) => at);

  return (
    <MaskedView
      style={StyleSheet.absoluteFill}
      maskElement={
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={colors as [string, string, ...string[]]}
          locations={locations as [number, number, ...number[]]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      }
    >
      {children}
    </MaskedView>
  );
}

export default function SportCarousel() {
  const { theme } = useUniwind();
  const lineColor =
    theme === "dark" ? THEME_COLORS.greenaccent : THEME_COLORS.redaccent;
  const [width, setWidth] = useState(0);
  // Continuous slide position: 0 = first slide centred, 1 = second, ... and
  // it keeps counting up; each slide wraps around with Animated.modulo.
  const [position] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let reduceMotion = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reduceMotion = enabled;
    });

    // Only ever one pending timer, even if a finish callback fires twice.
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(advance, PAUSE_MS);
    };

    const advance = () => {
      // Always move one slide on from wherever the track actually is, so a
      // remount or reload never makes it rewind through several slides.
      position.stopAnimation((value) => {
        if (cancelled) {
          return;
        }
        const target = Math.round(value) + 1;
        const steps = [
          Animated.timing(position, {
            toValue: target,
            duration: reduceMotion ? 0 : SLIDE_MS,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          ...(reduceMotion ? [] : SHUDDER_STEPS).map((offset) =>
            Animated.timing(position, {
              toValue: target + offset,
              duration: SHUDDER_STEP_MS,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ),
        ];

        Animated.sequence(steps).start(({ finished }) => {
          if (finished && !cancelled) {
            schedule();
          }
        });
      });
    };

    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      position.stopAnimation();
    };
  }, [position]);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const slideWidth = Math.min(width * SLIDE_WIDTH_RATIO, MAX_SLIDE_WIDTH);
  const slideHeight = slideWidth / IMAGE_ASPECT_RATIO;
  const centreLeft = (width - slideWidth) / 2;
  const masks = edgeMasks(width > 0 ? centreLeft / width : 0);

  // Where each slide sits relative to the centre, in slides, wrapped into
  // [-2, 2): -1 = left peek, 0 = centre, 1 = right peek, -2 = off screen (it
  // jumps to +2 while hidden, then slides in from the right).
  const translations = useMemo(
    () =>
      SLIDES.map((_, index) =>
        Animated.multiply(
          Animated.add(
            Animated.modulo(
              Animated.add(Animated.multiply(position, -1), index + 2),
              SLIDES.length,
            ),
            -2,
          ),
          slideWidth,
        ),
      ),
    [position, slideWidth],
  );

  const renderTrack = (blurred: boolean) =>
    SLIDES.map((slide, index) => (
      <Animated.Image
        key={slide.key}
        source={slide.source}
        tintColor={lineColor}
        blurRadius={blurred ? BLUR_RADIUS : undefined}
        resizeMode="contain"
        style={{
          position: "absolute",
          top: 0,
          left: centreLeft,
          width: slideWidth,
          height: slideHeight,
          transform: [{ translateX: translations[index] }],
        }}
      />
    ));

  return (
    <View
      style={{
        alignSelf: "stretch",
        marginHorizontal: -PAGE_GUTTER,
        height: slideHeight,
      }}
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Sports courts: soccer, padel, tennis and basketball"
    >
      {width > 0 && (
        <HorizontalMask stops={masks.outerFade}>
          <HorizontalMask stops={masks.blur}>
            {renderTrack(true)}
          </HorizontalMask>
          <HorizontalMask stops={masks.sharp}>
            {renderTrack(false)}
          </HorizontalMask>
        </HorizontalMask>
      )}
    </View>
  );
}
