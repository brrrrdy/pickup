import { forwardRef, type ReactNode } from "react";
import { type StyleProp, type ViewStyle, ScrollView, View } from "react-native";
import AppFooter from "./AppFooter";
import { PageBody, PageHeader } from "../typography/Typography";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showFooter?: boolean;
};

type PageShellSectionProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

type PageShellIntroProps = {
  title: ReactNode;
  body?: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
};

const PageShell = forwardRef<ScrollView, PageShellProps>(function PageShell(
  { children, className = "", contentClassName = "", showFooter = true },
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
        <View
          className={`w-full self-center max-w-5xl px-4 pt-6 ${contentClassName}`.trim()}
        >
          {children}
        </View>
      </View>

      {showFooter ? (
        <View className="w-full border-t border-transparent bg-primary px-4 pt-4 pb-3">
          <AppFooter />
        </View>
      ) : null}
    </ScrollView>
  );
});

export function PageShellHeader({
  children,
  className = "",
  style,
}: PageShellSectionProps) {
  return (
    <View
      className={`w-full max-w-4xl self-center gap-2 ${className}`.trim()}
      style={style}
    >
      {children}
    </View>
  );
}

export function PageShellIntro({
  title,
  body,
  className = "",
  titleClassName = "",
  bodyClassName = "",
}: PageShellIntroProps) {
  return (
    <PageShellHeader className={className}>
      <PageHeader className={titleClassName}>{title}</PageHeader>
      {body ? <PageBody className={bodyClassName}>{body}</PageBody> : null}
    </PageShellHeader>
  );
}

export function PageShellBody({
  children,
  className = "",
  style,
}: PageShellSectionProps) {
  return (
    <View
      className={`w-full max-w-4xl self-center gap-6 ${className}`.trim()}
      style={style}
    >
      {children}
    </View>
  );
}

export default PageShell;
