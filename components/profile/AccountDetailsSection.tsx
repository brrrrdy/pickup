import { Text, View } from "react-native";
import ProfileAccordionSection from "../common/ProfileAccordionSection";

type ProfileItem = {
  label: string;
  value: string;
};

type AccountDetailsSectionProps = {
  isOpen: boolean;
  onToggle: () => void;
  profileItems: ProfileItem[];
  favouriteSports: string[];
};

export default function AccountDetailsSection({
  isOpen,
  onToggle,
  profileItems,
  favouriteSports,
}: AccountDetailsSectionProps) {
  return (
    <ProfileAccordionSection
      title="account details and preferences"
      isOpen={isOpen}
      onToggle={onToggle}
      expandLabel="Expand account details and preferences"
      collapseLabel="Collapse account details and preferences"
    >
      {profileItems.map((item) => (
        <View key={item.label} className="gap-1">
          <Text className="text-sm font-semibold font-sans uppercase tracking-wide text-defaulttext/70">
            {item.label}
          </Text>
          <Text className="text-base font-sans text-defaulttext">
            {item.value}
          </Text>
        </View>
      ))}

      <View className="gap-2">
        <Text className="text-sm font-semibold font-sans uppercase tracking-wide text-defaulttext/70">
          favourite sports
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {favouriteSports.map((sport) => (
            <View
              key={sport}
              className="rounded-full border border-border bg-white px-3 py-1"
            >
              <Text className="text-sm font-sans text-defaulttext">
                {sport}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ProfileAccordionSection>
  );
}
