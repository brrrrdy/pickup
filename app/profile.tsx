import { ScrollView, Text, View } from "react-native";
import profile from "../mockdata/profile.json";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function Profile() {
  const content = profile;

  const profileItems = [
    { label: "email", value: content.email },
    { label: "username", value: content.username },
    { label: "website language", value: content.websiteLanguage },
    { label: "appearance", value: content.appearance },
    { label: "current timezone", value: content.currentTimezone },
    { label: "location (country)", value: content.locationCountry },
  ];

  return (
    <PageContent className="w-full px-4 pt-6">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-8">
          <PageHeader>profile</PageHeader>

          <PageBody>
            Manage your account preferences and favorite sports.
          </PageBody>

          <View className="w-full max-w-xl rounded-2xl border border-border bg-secondary p-5">
            <View className="gap-4">
              {profileItems.map((item) => (
                <View key={item.label} className="gap-1">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-defaulttext/70">
                    {item.label}
                  </Text>
                  <Text className="text-base text-defaulttext">
                    {item.value}
                  </Text>
                </View>
              ))}

              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-wide text-defaulttext/70">
                  favourite sports
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {content.favouriteSports.map((sport) => (
                    <View
                      key={sport}
                      className="rounded-full border border-border bg-white px-3 py-1"
                    >
                      <Text className="text-sm text-defaulttext">{sport}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageContent>
  );
}
