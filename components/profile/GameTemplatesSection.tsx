import { Text, View } from "react-native";
import type { ProfileGameTemplateDisplay } from "../types/find-game";
import ProfileAccordionSection from "../common/ProfileAccordionSection";

type GameTemplatesSectionProps = {
  isOpen: boolean;
  onToggle: () => void;
  templates: ProfileGameTemplateDisplay[];
};

export default function GameTemplatesSection({
  isOpen,
  onToggle,
  templates,
}: GameTemplatesSectionProps) {
  return (
    <ProfileAccordionSection
      title="game templates"
      isOpen={isOpen}
      onToggle={onToggle}
      expandLabel="Expand game templates"
      collapseLabel="Collapse game templates"
    >
      {templates.length > 0 ? (
        templates.map((template) => (
          <View
            key={template.id}
            className="gap-1 rounded-xl border border-border bg-white px-3 py-3"
          >
            <Text className="text-sm font-semibold text-defaulttext">
              {template.templateName}
            </Text>
            <Text className="text-xs font-semibold uppercase tracking-wide text-defaulttext/70">
              {template.sportName}
            </Text>
            <Text className="text-sm text-defaulttext/80">
              {template.location}
            </Text>
            <Text className="text-sm text-defaulttext/80">
              Duration: {template.durationMinutes} min
            </Text>
            <Text className="text-sm text-defaulttext/80">
              Players: {template.maxPlayers}
            </Text>
            {template.notes ? (
              <Text className="text-sm text-defaulttext/70">
                {template.notes}
              </Text>
            ) : null}
          </View>
        ))
      ) : (
        <Text className="text-sm text-defaulttext/80">
          No templates saved yet.
        </Text>
      )}
    </ProfileAccordionSection>
  );
}
