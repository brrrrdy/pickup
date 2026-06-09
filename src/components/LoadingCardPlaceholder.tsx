import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export function LoadingCardPlaceholder() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      pulse.setValue(0);
    };
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.65, 1, 0.65],
  });

  const backgroundColor = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#d9e6dc", "#edf4ee", "#d9e6dc"],
  });

  return (
    <View className="h-[158px] flex-1 rounded-2xl border border-border bg-white p-3.5">
      <Animated.View
        className="mb-3 h-20 rounded-xl"
        style={{ opacity, backgroundColor }}
      />
      <Animated.View
        className="mb-2 h-3.5 w-[78%] rounded-full"
        style={{ opacity, backgroundColor }}
      />
      <Animated.View
        className="h-3.5 w-[52%] rounded-full"
        style={{ opacity, backgroundColor }}
      />
    </View>
  );
}
