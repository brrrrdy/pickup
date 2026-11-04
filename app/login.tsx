import { Text, View } from "react-native";
import LoginButton from "../components/buttons/LoginButton";
import FormField from "../components/common/FormField";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import loginFormContent from "../content/loginform.json";
import { useLoginForm } from "../hooks/use-login-form";

export default function Login() {
  const content = loginFormContent.en;

  const {
    values,
    canSubmit,
    isSubmitting,
    error,
    setFieldValue,
    handleSubmit,
  } = useLoginForm({ content });

  return (
    <PageShell contentClassName="relative overflow-hidden pb-3">
      <PageShellIntro
        title={content.hero.heading}
        body={content.hero.subheading}
      />

      <PageShellBody className="gap-5">
        <FormField
          label={content.fields.email.label}
          value={values.email}
          onChangeText={(value) => setFieldValue("email", value)}
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={content.fields.email.placeholder}
        />

        <FormField
          label={content.fields.password.label}
          value={values.password}
          onChangeText={(value) => setFieldValue("password", value)}
          autoComplete="password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          placeholder={content.fields.password.placeholder}
          returnKeyType="go"
          onSubmitEditing={() => {
            if (canSubmit) handleSubmit();
          }}
        />

        {error ? (
          <Text
            accessibilityRole="alert"
            className="text-sm font-sans text-redaccent"
          >
            {error}
          </Text>
        ) : null}

        <LoginButton
          onPress={handleSubmit}
          label={
            isSubmitting ? content.submit.submittingLabel : content.submit.label
          }
          disabled={!canSubmit}
          className={
            canSubmit ? "mt-2 bg-purpleaccent" : "mt-2 bg-purpleaccent/45"
          }
        />

        <View className="items-center">
          <Text className="text-sm font-sans text-defaulttext">
            {content.inviteOnly.label}
          </Text>
        </View>
      </PageShellBody>
    </PageShell>
  );
}
