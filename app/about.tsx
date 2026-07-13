import about from "../content/about.json";
import PageShell, { PageShellIntro } from "../components/layout/PageShell";

export default function About() {
  const content = about.en;

  return (
    <PageShell>
      <PageShellIntro title={content.header} body={content.body} />
    </PageShell>
  );
}
