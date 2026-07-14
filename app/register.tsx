import { Link, useRouter } from "expo-router";
import { Platform, Pressable, Switch, Text, View } from "react-native";
import CreateAccountButton from "../components/buttons/CreateAccountButton";
import FormField from "../components/common/FormField";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import { THEME_COLORS } from "../lib/theme/colors";
import registerFormContent from "../content/registerform.json";
import { useRegisterForm } from "./hooks/use-register-form";

export default function Register() {
  const router = useRouter();
  const content = registerFormContent.en;

  const {
    values,
    agreeToPolicies,
    canSubmit,
    setFieldValue,
    setAgreeToPolicies,
    handleSubmit,
  } = useRegisterForm({ content });

  const handleOpenTermsAndPrivacy = () => {
    if (Platform.OS === "web") {
      globalThis.open?.("/terms-and-privacy", "_blank", "noopener,noreferrer");
      return;
    }

    router.push("/terms-and-privacy");
  };

  return (
    <PageShell contentClassName="relative overflow-hidden pb-3">
      <PageShellIntro
        title={content.hero.heading}
        body={content.hero.subheading}
      />

      <PageShellBody className="gap-5">
        <FormField
          label={content.fields.firstName.label}
          value={values.firstName}
          onChangeText={(value) => setFieldValue("firstName", value)}
          autoComplete="given-name"
          placeholder={content.fields.firstName.placeholder}
        />

        <FormField
          label={content.fields.lastName.label}
          value={values.lastName}
          onChangeText={(value) => setFieldValue("lastName", value)}
          autoComplete="family-name"
          placeholder={content.fields.lastName.placeholder}
        />

        <FormField
          label={content.fields.username.label}
          value={values.username}
          onChangeText={(value) => setFieldValue("username", value)}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={content.fields.username.placeholder}
        />

        <FormField
          label={content.fields.email.label}
          value={values.email}
          onChangeText={(value) => setFieldValue("email", value)}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
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
        />

        <FormField
          label={content.fields.confirmPassword.label}
          value={values.confirmPassword}
          onChangeText={(value) => setFieldValue("confirmPassword", value)}
          autoComplete="password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          placeholder={content.fields.confirmPassword.placeholder}
        />

        <View className="flex-row items-center gap-3">
          <Switch
            value={agreeToPolicies}
            onValueChange={setAgreeToPolicies}
            thumbColor={THEME_COLORS.cream}
            trackColor={{
              false: THEME_COLORS.defaulttext,
              true: THEME_COLORS.purpleaccent,
            }}
          />
          <View className="flex-1 flex-row flex-wrap items-center">
            <Text className="text-sm font-sans text-defaulttext">
              {content.consent.prefix}
            </Text>
            <Pressable
              onPress={handleOpenTermsAndPrivacy}
              accessibilityRole="link"
              accessibilityLabel={content.consent.linkLabel}
            >
              <Text className="text-sm font-sans text-defaulttext underline">
                {content.consent.linkLabel}
              </Text>
            </Pressable>
            <Text className="text-sm font-sans text-defaulttext">
              {content.consent.suffix}
            </Text>
          </View>
        </View>

        <CreateAccountButton
          onPress={handleSubmit}
          label={content.submit.label}
          disabled={!canSubmit}
          className={
            canSubmit ? "mt-2 bg-purpleaccent" : "mt-2 bg-purpleaccent/45"
          }
        />

        <View className="items-center">
          <Link href="/login" asChild>
            <Text className="text-sm font-sans text-defaulttext underline">
              {content.signInLink.label}
            </Text>
          </Link>
        </View>
      </PageShellBody>
    </PageShell>
  );
}
