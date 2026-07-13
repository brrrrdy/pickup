import { useRouter } from "expo-router";
import { Pressable, Switch, Text, View } from "react-native";
import { Platform } from "react-native";
import { useContactForm } from "./hooks/use-contact-form";
import contactFormContent from "../content/contactform.json";
import FormField from "../components/common/FormField";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import { THEME_COLORS } from "../lib/theme/colors";

export default function Contact() {
  const router = useRouter();
  const content = contactFormContent.en;

  const {
    values,
    agreeToPolicies,
    canSubmit,
    setFieldValue,
    setAgreeToPolicies,
    handleSubmit,
  } = useContactForm({ content });

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
          label={content.fields.organisation.label}
          value={values.organisation}
          onChangeText={(value) => setFieldValue("organisation", value)}
          autoComplete="organization"
          placeholder={content.fields.organisation.placeholder}
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
          label={content.fields.message.label}
          value={values.message}
          onChangeText={(value) => setFieldValue("message", value)}
          multiline
          numberOfLines={5}
          placeholder={content.fields.message.placeholder}
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
            <Text className="text-sm text-defaulttext">
              {content.consent.prefix}
            </Text>
            <Pressable
              onPress={handleOpenTermsAndPrivacy}
              accessibilityRole="link"
              accessibilityLabel={content.consent.linkLabel}
            >
              <Text className="text-sm text-defaulttext underline">
                {content.consent.linkLabel}
              </Text>
            </Pressable>
            <Text className="text-sm text-defaulttext">
              {content.consent.suffix}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          className={`mt-2 rounded-lg px-4 py-3 ${canSubmit ? "bg-purpleaccent" : "bg-purpleaccent/45"}`}
        >
          <Text className="text-center text-sm font-semibold text-defaulttext">
            {content.submit.label}
          </Text>
        </Pressable>
      </PageShellBody>
    </PageShell>
  );
}
