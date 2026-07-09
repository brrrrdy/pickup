import { View } from "react-native";
import manifesto from "../content/manifesto.json";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";
import HandshakeIcon from "../assets/handshake_200dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.svg";

export default function Manifesto() {
  const content = manifesto.en;

  return (
    <PageLayout>
      <PageContent className="items-stretch justify-start gap-8 px-4 pt-6">
        <View className="w-full items-center">
          <HandshakeIcon
            width={200}
            height={200}
            className="text-greenaccent"
          />
        </View>

        <PageHeader className="w-full text-center">{content.header}</PageHeader>

        <PageBody className="w-full max-w-2xl text-center">
          {content.body}
        </PageBody>
      </PageContent>
    </PageLayout>
  );
}
