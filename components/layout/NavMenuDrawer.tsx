import { Link, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import FindGameButton from "../buttons/FindGameButton";
import StartGameButton from "../buttons/StartGameButton";

export type NavLink = {
  href: "/" | "/about" | "/contact" | "/profile" | "/find-game" | "/manifesto";
  label: string;
};

type NavMenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  links: readonly NavLink[];
};

export default function NavMenuDrawer({
  isOpen,
  onClose,
  pathname,
  links,
}: NavMenuDrawerProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.8, 360);
  const progress = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(isOpen);

  const overlayOpacity = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.45],
      }),
    [progress],
  );

  const panelTranslateX = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [panelWidth, 0],
      }),
    [panelWidth, progress],
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
      }
    });
  }, [isOpen, progress]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        <View className="flex-1 flex-row">
          <Pressable
            className="flex-1"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="close navigation menu"
          />

          <Animated.View
            className="relative h-full border-l border-border bg-secondary px-4 pb-6 pt-16"
            style={{
              transform: [{ translateX: panelTranslateX }],
              width: panelWidth,
            }}
          >
            <Pressable
              onPress={onClose}
              className="absolute -left-11 top-4 z-10 h-9 w-9 items-center justify-center rounded-full bg-defaulttext"
              accessibilityRole="button"
              accessibilityLabel="close navigation panel"
            >
              <Text className="text-lg font-semibold font-sans text-white">
                X
              </Text>
            </Pressable>

            <View className="gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    asChild
                  >
                    <Pressable className="rounded-lg px-3 py-3">
                      <Text
                        className={
                          isActive
                            ? "text-lg font-semibold font-sans text-defaulttext"
                            : "text-lg font-sans text-defaulttext"
                        }
                      >
                        {link.label}
                      </Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>

            <View className="mt-6 items-start gap-3 border-t border-border pt-4">
              <StartGameButton
                className="mt-0 bg-purpleaccent"
                onPress={() => {
                  onClose();
                  router.push("/start-game");
                }}
              />
              <FindGameButton
                className="mt-0 bg-greenaccent"
                onPress={() => {
                  onClose();
                  router.push("/find-game");
                }}
              />
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}
