import ActionButton from "../common/ActionButton";

type LoginButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export default function LoginButton({
  onPress,
  label = "log in",
  disabled = false,
  className = "mt-2 bg-purpleaccent",
}: LoginButtonProps) {
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
