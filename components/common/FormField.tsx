import { TextInput, type TextInputProps, View } from "react-native";
import FormLabel from "./FormLabel";
import { useThemeColor } from "../../lib/theme/use-theme-color";

type FormFieldProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  inputClassName?: string;
} & Pick<
  TextInputProps,
  | "autoComplete"
  | "autoCapitalize"
  | "keyboardType"
  | "autoCorrect"
  | "secureTextEntry"
  | "onSubmitEditing"
  | "onBlur"
  | "returnKeyType"
>;

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  inputClassName = "",
  autoComplete,
  autoCapitalize,
  keyboardType,
  autoCorrect,
  secureTextEntry,
  onSubmitEditing,
  onBlur,
  returnKeyType,
}: FormFieldProps) {
  const placeholderColor = useThemeColor("defaulttext");

  return (
    <View className="w-full gap-2">
      {label ? <FormLabel>{label}</FormLabel> : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        returnKeyType={returnKeyType}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
        className={`w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-defaulttext font-sans ${multiline ? "min-h-32" : ""} ${inputClassName}`.trim()}
      />
    </View>
  );
}
