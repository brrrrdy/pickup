import { useState } from "react";
import { TextInput, View } from "react-native";

type LocationSearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
};

export default function LocationSearchBar({
  value,
  onChangeText,
}: LocationSearchBarProps) {
  const [query, setQuery] = useState("");
  const inputValue = value ?? query;

  const handleChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
      return;
    }

    setQuery(text);
  };

  return (
    <View className="w-full max-w-xl px-4">
      <TextInput
        className="w-full rounded-xl border border-transparent bg-secondary px-4 py-3 text-foreground"
        placeholder="enter your location..."
        placeholderTextColor="#35513f"
        value={inputValue}
        onChangeText={handleChange}
      />
    </View>
  );
}
