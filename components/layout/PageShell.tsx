import { forwardRef, type ReactNode } from "react";
import { type StyleProp, type ViewStyle, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import AppFooter from "./AppFooter";
import { PageBody, PageHeader } from "../typography/Typography";
import { useWindowDimensions } from "react-native";

const defaultVerticalGapClass = "gap-2.5";

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
  const { height } = useWindowDimensions();
  const footerMinHeight = Math.round(height / 6);

  return (
    <ScrollView
      ref={ref}
      className="w-full flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className={twMerge(
          `w-full flex-1 ${defaultVerticalGapClass} bg-cream px-4 py-4`,
          className,
        )}
      >
        <View
          className={twMerge(
            "w-full self-center max-w-5xl px-4 py-1",
            contentClassName,
          )}
        >
          {children}
        </View>
      </View>

      {showFooter ? (
        <View
          className="w-full border-t border-transparent bg-primary px-4 pt-3 pb-3"
          style={{ minHeight: footerMinHeight, justifyContent: "center" }}
        >
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
      className={twMerge(
        `w-full max-w-4xl self-center ${defaultVerticalGapClass}`,
        className,
      )}
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
      className={twMerge(
        `w-full max-w-4xl self-center mt-2.5 ${defaultVerticalGapClass}`,
        className,
      )}
      style={style}
    >
      {children}
    </View>
  );
}

export default PageShell;
