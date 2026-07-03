import { forwardRef, type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import AppFooter from "./AppFooter";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
};

const PageLayout = forwardRef<ScrollView, PageLayoutProps>(function PageLayout(
  { children, className = "" },
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
        className={`w-full flex-1 justify-between gap-10 bg-cream px-4 py-5 ${className}`.trim()}
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
