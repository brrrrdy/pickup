import { useRef } from "react";
import { ScrollView, View } from "react-native";
import StartGameCard from "../components/common/StartGameCard";
import PageSection from "../components/layout/PageSection";
import PageShell, { PageShellBody } from "../components/layout/PageShell";

export default function StartGame() {
  const scrollRef = useRef<ScrollView>(null);

  const handleResetToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <PageShell ref={scrollRef}>
      <PageShellBody className="max-w-5xl gap-4">
        <PageSection className="items-center">
          <StartGameCard onResetToTop={handleResetToTop} />
        </PageSection>
      </PageShellBody>
    </PageShell>
  );
}
