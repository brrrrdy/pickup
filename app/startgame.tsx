import { PageBody, PageHeader } from "../components/typography/Typography";
import findagame from "../content/findagame.json";
import PageContent from "../components/layout/PageContent";

export default function StartGame() {
  return (
    <PageContent className="items-start justify-start gap-6">
      <PageHeader>Start a Game</PageHeader>
      <PageBody>Create a new pickup game and invite players nearby.</PageBody>
    </PageContent>
  );
}
