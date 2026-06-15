import { View } from "react-native";
import about from "../content/about.json";
import { PageHeader, PageBody } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function About() {
  const content = about.en;

  return (
    <PageContent className="items-start justify-start gap-10">
      <PageHeader>{content.header}</PageHeader>
      <PageBody>{content.body}</PageBody>
    </PageContent>
  );
}
