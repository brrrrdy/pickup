import termsAndPrivacy from "../content/termsandprivacy.json";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";

export default function TermsAndPrivacy() {
  const content = termsAndPrivacy.en;

  return (
    <PageLayout>
      <PageContent className="items-stretch justify-start gap-10">
        <PageHeader>{content.header}</PageHeader>
        <PageBody>{content.body}</PageBody>
      </PageContent>
    </PageLayout>
  );
}
