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
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className={`w-full gap-10 ${className}`.trim()}>
        {children}

        <View className="border-t border-transparent px-4 pt-6 pb-4">
          <AppFooter />
        </View>
      </View>
    </ScrollView>
  );
});

export default PageLayout;
