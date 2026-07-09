import { forwardRef, type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import AppFooter from "./AppFooter";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
};

const PageLayout = forwardRef<ScrollView, PageLayoutProps>(function PageLayout(
  { children, className = "", showFooter = true },
  ref,
) {
  return (
    <ScrollView
      ref={ref}
      className="w-full flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
      showsVerticalScrollIndicator={false}
    >
      <View className={`w-full gap-6 bg-cream px-4 py-4 ${className}`.trim()}>
        {children}
      </View>

      {showFooter ? (
        <View className="w-full border-t border-transparent bg-primary px-4 pt-4 pb-3">
          <AppFooter />
        </View>
      ) : null}
    </ScrollView>
  );
});

export default PageLayout;
