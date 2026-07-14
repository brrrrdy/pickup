import { Pressable, Text, View } from "react-native";
import FormField from "./common/FormField";

type LocationSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  onSelectSuggestion: (value: string) => void;
  placeholder: string;
  suggestionA11yPrefix: string;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
};

export default function LocationSearchBar({
  value,
  onChangeText,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  placeholder,
  suggestionA11yPrefix,
  onSubmitEditing,
  onBlur,
}: LocationSearchBarProps) {
  return (
    <View className="w-full max-w-4xl gap-2">
      <FormField
        placeholder={placeholder}
        label=""
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing ? () => onSubmitEditing() : undefined}
        onBlur={onBlur}
        returnKeyType="search"
        inputClassName="rounded-xl border-transparent bg-secondary"
      />

      {showSuggestions && suggestions.length > 0 ? (
        <View className="overflow-hidden rounded-xl border border-border bg-white">
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPressIn={() => onSelectSuggestion(suggestion)}
              className="border-b border-border px-4 py-3 last:border-b-0"
              accessibilityRole="button"
              accessibilityLabel={`${suggestionA11yPrefix} ${suggestion}`}
            >
              <Text className="font-sans text-defaulttext">{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
