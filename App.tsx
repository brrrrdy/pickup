import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>P</Text>
        </View>

        <Text style={styles.appName}>pickup</Text>
        <Text style={styles.tagline}>Find casual local games in minutes.</Text>
      </View>

      <View style={styles.buttonStack}>
        <View style={[styles.buttonBase, styles.primaryButton]}>
          <Text style={[styles.buttonTextBase, styles.primaryButtonText]}>
            View Matches
          </Text>
        </View>

        <View style={[styles.buttonBase, styles.secondaryButton]}>
          <Text style={[styles.buttonTextBase, styles.secondaryButtonText]}>
            Create Match
          </Text>
        </View>

        <View style={[styles.buttonBase, styles.ghostButton]}>
          <Text style={[styles.buttonTextBase, styles.ghostButtonText]}>
            Register / Log in
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f8f4",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 88,
    paddingBottom: 48,
  },
  hero: {
    alignItems: "center",
    marginTop: 24,
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#1f6f3d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  appName: {
    color: "#112418",
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 10,
    textTransform: "lowercase",
  },
  tagline: {
    color: "#35513f",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 290,
  },
  buttonStack: {
    gap: 14,
  },
  buttonBase: {
    minHeight: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: "#1f6f3d",
    borderColor: "#1f6f3d",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderColor: "#1f6f3d",
  },
  ghostButton: {
    backgroundColor: "#eaf2eb",
    borderColor: "#d2e2d4",
  },
  buttonTextBase: {
    fontSize: 17,
    fontWeight: "700",
  },
  primaryButtonText: {
    color: "#ffffff",
  },
  secondaryButtonText: {
    color: "#1f6f3d",
  },
  ghostButtonText: {
    color: "#294534",
  },
});
