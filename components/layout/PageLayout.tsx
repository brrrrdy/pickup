import { forwardRef, type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import AppFooter from "./AppFooter";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  fillViewport?: boolean;
};

const PageLayout = forwardRef<ScrollView, PageLayoutProps>(function PageLayout(
  { children, className = "", fillViewport = false },
  ref,
) {
  return (
    <ScrollView
      ref={ref}
      className="w-full flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className={`w-full gap-10 bg-cream px-4 py-5 ${fillViewport ? "" : "flex-1 justify-between"} ${className}`.trim()}
        style={fillViewport ? { minHeight: "100%" } : undefined}
      >
        {children}
      </View>

      <View className="w-full border-t border-transparent bg-primary px-4 pt-6 pb-4">
        <AppFooter />
      </View>
    </ScrollView>
  );
});

export default PageLayout;
