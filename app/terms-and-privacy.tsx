import termsAndPrivacy from "../content/termsandprivacy.json";
import PageShell, { PageShellIntro } from "../components/layout/PageShell";

export default function TermsAndPrivacy() {
  const content = termsAndPrivacy.en;

  return (
    <PageShell>
      <PageShellIntro title={content.header} body={content.body} />
    </PageShell>
  );
}
