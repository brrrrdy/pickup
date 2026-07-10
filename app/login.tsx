import { Link } from "expo-router";
import { Text, View } from "react-native";
import LoginButton from "../components/buttons/LoginButton";
import FormField from "../components/common/FormField";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";
import loginFormContent from "../content/loginform.json";
import { useLoginForm } from "./hooks/use-login-form";

export default function Login() {
  const content = loginFormContent.en;

  const { values, canSubmit, setFieldValue, handleSubmit } = useLoginForm({
    content,
  });

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
            label={content.fields.username.label}
            value={values.username}
            onChangeText={(value) => setFieldValue("username", value)}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={content.fields.username.placeholder}
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

          <LoginButton
            onPress={handleSubmit}
            label={content.submit.label}
            disabled={!canSubmit}
            className={
              canSubmit ? "mt-2 bg-purpleaccent" : "mt-2 bg-purpleaccent/45"
            }
          />

          <View className="items-center">
            <Link href="/register" asChild>
              <Text className="text-sm text-defaulttext underline">
                {content.registerLink.label}
              </Text>
            </Link>
          </View>
        </View>
      </PageContent>
    </PageLayout>
  );
}
