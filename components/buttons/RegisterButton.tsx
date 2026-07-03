import { Link } from "expo-router";
import actionButtonsContent from "../../content/actionbuttons.json";
import { PageBody } from "../typography/Typography";

type RegisterButtonProps = {
  href?: string;
  label?: string;
  className?: string;
};

export default function RegisterButton({
  href = "/register",
  label = actionButtonsContent.en.registerPrompt,
  className = "",
}: RegisterButtonProps) {
  return (
    <Link href={href} asChild>
      <PageBody className={className}>{label}</PageBody>
    </Link>
  );
}
