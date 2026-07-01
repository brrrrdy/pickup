import { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";
import profile from "../mockdata/profile.json";
import findSportData from "../mockdata/find-sport-data.json";
import { mapAttendingMatchesByTime } from "../mockdata/mapFindSports";
import type { FindSportMockData } from "../components/types/findGame";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function Profile() {
  const content = profile;
  const [isAccountSectionOpen, setIsAccountSectionOpen] = useState(false);
  const [isCalendarSectionOpen, setIsCalendarSectionOpen] = useState(false);

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const profileItems = [
    { label: "email", value: content.email },
    { label: "username", value: content.username },
    { label: "website language", value: content.websiteLanguage },
    { label: "appearance", value: content.appearance },
    { label: "current timezone", value: content.currentTimezone },
    { label: "location (country)", value: content.locationCountry },
  ];

  const upcomingMatches = mapAttendingMatchesByTime(
    findSportData as FindSportMockData,
    "future",
  );

  return (
    <PageContent className="w-full px-4 pt-6">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-8">
          <PageHeader>account details and preferences</PageHeader>

          <PageBody>
            Manage your account preferences and favorite sports.
          </PageBody>

          <View className="w-full max-w-xl rounded-2xl border border-border bg-secondary p-5">
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setIsAccountSectionOpen((prev) => !prev);
              }}
              className="flex-row items-center justify-between"
              accessibilityRole="button"
              accessibilityLabel={
                isAccountSectionOpen
                  ? "Collapse account details and preferences"
                  : "Expand account details and preferences"
              }
            >
              <Text className="text-base font-semibold text-defaulttext">
                account details and preferences
              </Text>
              <Text className="text-xl text-defaulttext/70">
                {isAccountSectionOpen ? "▴" : "▾"}
              </Text>
            </Pressable>

            {isAccountSectionOpen ? (
              <View className="mt-4 gap-4">
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
                        <Text className="text-sm text-defaulttext">
                          {sport}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          <View className="w-full max-w-xl rounded-2xl border border-border bg-secondary p-5">
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setIsCalendarSectionOpen((prev) => !prev);
              }}
              className="flex-row items-center justify-between"
              accessibilityRole="button"
              accessibilityLabel={
                isCalendarSectionOpen ? "Collapse calendar" : "Expand calendar"
              }
            >
              <Text className="text-base font-semibold text-defaulttext">
                calendar
              </Text>
              <Text className="text-xl text-defaulttext/70">
                {isCalendarSectionOpen ? "▴" : "▾"}
              </Text>
            </Pressable>

            {isCalendarSectionOpen ? (
              <View className="mt-4 gap-4">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match) => (
                    <View
                      key={match.id}
                      className="gap-1 rounded-xl border border-border bg-white px-3 py-3"
                    >
                      <Text className="text-xs font-semibold uppercase tracking-wide text-defaulttext/70">
                        {match.sportName}
                      </Text>
                      <Text className="text-base text-defaulttext">
                        {match.displayDateTime}
                      </Text>
                      <Text className="text-sm text-defaulttext/80">
                        {match.location}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm text-defaulttext/80">
                    No upcoming attended matches yet.
                  </Text>
                )}

                <Link href="/match-history" asChild>
                  <Pressable accessibilityRole="link">
                    <Text className="text-sm font-semibold text-purpleaccent underline">
                      view match history
                    </Text>
                  </Pressable>
                </Link>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </PageContent>
  );
}
