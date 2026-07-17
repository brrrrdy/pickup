import underTheHood from "../content/underthehood.json";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import RichTextSection from "../components/layout/RichTextSection";
import type { RichContentBlock } from "../types/rich-content";

type UnderTheHoodLocaleContent = {
  header: string;
  blocks: RichContentBlock[];
};

export default function UnderTheHood() {
  const content = underTheHood.en as UnderTheHoodLocaleContent;

  return (
    <PageShell>
      <PageShellIntro title={content.header} />
      <PageShellBody>
        <RichTextSection blocks={content.blocks} />
      </PageShellBody>
    </PageShell>
  );
}
