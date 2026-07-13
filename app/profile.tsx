import { useEffect, useState } from "react";
import { Platform, UIManager, View } from "react-native";
import profile from "../mockdata/profile.json";
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
  const content = profile;
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

  const profileTemplates = mapGameTemplatesForProfile(
    gameTemplateData as GameTemplateMockData,
    findSportData as FindSportMockData,
  );

  return (
    <PageShell>
      <PageShellIntro
        title="account details and preferences"
        body="Manage your account preferences and favorite sports."
      />

      <PageShellBody>
        <AccountDetailsSection
          isOpen={isAccountSectionOpen}
          onToggle={() => setIsAccountSectionOpen((prev) => !prev)}
          profileItems={profileItems}
          favouriteSports={content.favouriteSports}
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
