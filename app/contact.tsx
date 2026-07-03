import { View, Text, Linking, Pressable } from "react-native";
import contact from "../content/contact.json";
import { PageHeader, PageBody } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";

export default function Contact() {
  const content = contact.en;

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${content.email.address}`);
  };

  const handlePhonePress = (telLink: string) => {
    Linking.openURL(`tel:${telLink}`);
  };

  return (
    <PageLayout>
      <PageContent className="items-start justify-start gap-10">
        <PageHeader>{content.title}</PageHeader>

        <PageBody>{content.intro}</PageBody>

        {/* Email */}

        <Pressable onPress={handleEmailPress}>
          <View className="gap-2">
            <Text className="text-sm font-semibold text-defaulttext">
              {content.emailLabel}
            </Text>
            <Text className="text-sm text-purpleaccent underline">
              {content.email.address}
            </Text>
          </View>
        </Pressable>
      </PageContent>
    </PageLayout>
  );
}
