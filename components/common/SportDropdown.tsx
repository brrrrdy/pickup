import { Pressable, Text, View } from "react-native";

type SportDropdownProps = {
  label: string;
  options: string[];
  selectedValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
};

export default function SportDropdown({
  label,
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
  placeholder = "select an option",
  accessibilityLabel = "choose an option",
  disabled = false,
}: SportDropdownProps) {
  return (
    <View className="w-full gap-2">
      <Text className="text-base font-semibold uppercase tracking-wide text-defaulttext/80">
        {label}
      </Text>

      <Pressable
        onPress={onToggle}
        disabled={disabled}
        className={`w-full rounded-xl border border-border px-4 py-3 ${
          disabled ? "bg-white/60" : "bg-white"
        }`}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, disabled }}
        accessibilityLabel={accessibilityLabel}
      >
        <Text
          className={`text-sm ${selectedValue ? "text-defaulttext" : "text-defaulttext/60"}`}
        >
          {selectedValue || placeholder}
        </Text>
      </Pressable>

      {isOpen && !disabled ? (
        <View className="overflow-hidden rounded-xl border border-border bg-white">
          {options.map((option) => {
            const isSelected = option === selectedValue;

            return (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                className={`px-4 py-3 ${isSelected ? "bg-greenaccent" : "bg-white"}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`select ${option}`}
              >
                <Text className="text-sm text-defaulttext">{option}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
