import { useEffect, useState } from "react";
import { Platform, UIManager, View } from "react-native";
import profile from "../mockdata/profile.json";
import profileContent from "../content/profile.json";
import findSportData from "../mockdata/find-sport-data.json";
import { mapAttendingMatchesByTime } from "../lib/mappers/mapFindSports";
import gameTemplateData from "../mockdata/game-templates.json";
import { mapGameTemplatesForProfile } from "../lib/mappers/mapGameTemplates";
import AccountDetailsSection from "../components/profile/AccountDetailsSection";
import CalendarSection from "../components/profile/CalendarSection";
import GameTemplatesSection from "../components/profile/GameTemplatesSection";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import type {
  FindSportMockData,
  GameTemplateMockData,
} from "../types/find-game";

export default function Profile() {
  const profileData = profile;
  const content = profileContent.en;
  const [isAccountSectionOpen, setIsAccountSectionOpen] = useState(false);
  const [isCalendarSectionOpen, setIsCalendarSectionOpen] = useState(false);
  const [isTemplatesSectionOpen, setIsTemplatesSectionOpen] = useState(false);

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const profileItems = [
    { label: content.fields.email, value: profileData.email },
    { label: content.fields.username, value: profileData.username },
    {
      label: content.fields.websiteLanguage,
      value: profileData.websiteLanguage,
    },
    { label: content.fields.appearance, value: profileData.appearance },
    {
      label: content.fields.currentTimezone,
      value: profileData.currentTimezone,
    },
    {
      label: content.fields.locationCountry,
      value: profileData.locationCountry,
    },
  ];

  const upcomingMatches = mapAttendingMatchesByTime(
    findSportData as FindSportMockData,
    "future",
  );

  const profileTemplates = mapGameTemplatesForProfile(
    gameTemplateData as GameTemplateMockData,
    findSportData as FindSportMockData,
  );

  return (
    <PageShell>
      <PageShellIntro title={content.intro.title} body={content.intro.body} />

      <PageShellBody>
        <AccountDetailsSection
          isOpen={isAccountSectionOpen}
          onToggle={() => setIsAccountSectionOpen((prev) => !prev)}
          profileItems={profileItems}
          favouriteSports={profileData.favouriteSports}
        />

        <CalendarSection
          isOpen={isCalendarSectionOpen}
          onToggle={() => setIsCalendarSectionOpen((prev) => !prev)}
          upcomingMatches={upcomingMatches}
        />

        <GameTemplatesSection
          isOpen={isTemplatesSectionOpen}
          onToggle={() => setIsTemplatesSectionOpen((prev) => !prev)}
          templates={profileTemplates}
        />
      </PageShellBody>
    </PageShell>
  );
}
