import { TextInput, View } from "react-native";

type LocationSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
};

export default function LocationSearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  onBlur,
}: LocationSearchBarProps) {
  return (
    <View className="w-full max-w-xl px-4">
      <TextInput
        className="w-full rounded-xl border border-transparent bg-secondary px-4 py-3 text-foreground"
        placeholder="enter your location..."
        placeholderTextColor="#35513f"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        returnKeyType="search"
      />
    </View>
  );
}
