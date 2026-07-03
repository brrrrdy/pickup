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

        {/* Phone Numbers */}
        <View>
          <Text className="text-sm font-semibold text-defaulttext mb-2">
            {content.phoneLabel}
          </Text>
          {content.phoneNumbers.map((phone) => (
            <Pressable
              key={phone.telLink}
              onPress={() => handlePhonePress(phone.telLink)}
            >
              <View className="gap-1 mb-2">
                <Text className="text-xs text-defaulttext/70">
                  {phone.country}
                </Text>
                <Text className="text-sm text-purpleaccent underline">
                  {phone.number}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Location */}

        <View className="gap-2">
          <Text className="text-sm font-semibold text-defaulttext">
            {content.locationLabel}
          </Text>
          <Text className="text-sm text-defaulttext/80">
            {content.location}
          </Text>
        </View>
      </PageContent>
    </PageLayout>
  );
}
