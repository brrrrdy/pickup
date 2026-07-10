import ActionButton from "../common/ActionButton";

type CreateAccountButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export default function CreateAccountButton({
  onPress,
  label = "create account",
  disabled = false,
  className = "mt-2 bg-purpleaccent",
}: CreateAccountButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      className={className}
      textClassName="text-sm font-semibold text-defaulttext"
    />
  );
}
