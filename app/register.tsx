import PageLayout from "../components/layout/PageLayout";
import { PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function Register() {
  return (
    <PageLayout>
      <PageContent className="items-stretch justify-start gap-8">
        <PageHeader>register</PageHeader>
      </PageContent>
    </PageLayout>
  );
}
