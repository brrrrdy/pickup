import { useRouter } from "expo-router";
import { Pressable, Switch, Text, View } from "react-native";
import { Platform } from "react-native";
import { useContactForm } from "./hooks/use-contact-form";
import contactFormContent from "../content/contactform.json";
import FormField from "../components/common/FormField";
import FormLabel from "../components/common/FormLabel";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";
import { THEME_COLORS } from "../lib/theme/colors";

export default function Contact() {
  const router = useRouter();
  const content = contactFormContent.en;

  const {
    values,
    country,
    agreeToPolicies,
    canSubmit,
    setFieldValue,
    setCountry,
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
    <PageLayout>
      <PageContent className="relative w-full items-stretch justify-start overflow-hidden px-0 pb-3 pt-4">
        <View className="w-full gap-2">
          <Text className="text-4xl font-semibold tracking-tight text-defaulttext">
            {content.hero.heading}
          </Text>
          <Text className="text-base text-defaulttext">
            {content.hero.subheading}
          </Text>
        </View>

        <View className="mt-8 w-full gap-5">
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
            label={content.fields.company.label}
            value={values.company}
            onChangeText={(value) => setFieldValue("company", value)}
            autoComplete="organization"
            placeholder={content.fields.company.placeholder}
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

          <View className="w-full gap-2">
            <FormLabel>{content.fields.phone.label}</FormLabel>

            <View className="flex-row gap-2">
              {content.countryOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setCountry(option)}
                  className={`rounded-full border px-4 py-2 ${country === option ? "border-purpleaccent bg-purpleaccent/25" : "border-defaulttext/20 bg-secondary/65"}`}
                >
                  <Text className="text-sm font-semibold text-defaulttext">
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            <FormField
              label=""
              value={values.phone}
              onChangeText={(value) => setFieldValue("phone", value)}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder={content.fields.phone.placeholder}
              inputClassName="mt-1"
            />
          </View>

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
        </View>
      </PageContent>
    </PageLayout>
  );
}
