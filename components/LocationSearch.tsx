import { Pressable, Text, TextInput, View } from "react-native";

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
    <View className="w-full max-w-xl gap-2 px-4">
      <TextInput
        className="w-full rounded-xl border border-transparent bg-secondary px-4 py-3 text-foreground"
        placeholder={placeholder}
        placeholderTextColor="#35513f"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        returnKeyType="search"
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
              <Text className="text-defaulttext">{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
