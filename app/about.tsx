import about from "../content/about.json";
import { PageHeader, PageBody } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";

export default function About() {
  const content = about.en;

  return (
    <PageLayout>
      <PageContent className="items-start justify-start gap-10">
        <PageHeader>{content.header}</PageHeader>
        <PageBody>{content.body}</PageBody>
      </PageContent>
    </PageLayout>
  );
}
