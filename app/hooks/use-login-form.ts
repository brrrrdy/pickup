import { useMemo } from "react";
import { Alert } from "react-native";
import { useForm } from "./use-form";

type LoginFormValues = {
  username: string;
  password: string;
};

type LoginFormContent = {
  alerts: {
    missingDetails: { title: string; message: string };
    shortPassword: { title: string; message: string };
    success: { title: string; message: string };
  };
};

type UseLoginFormParams = {
  content: LoginFormContent;
};

export function useLoginForm({ content }: UseLoginFormParams) {
  const formState = useForm<LoginFormValues>({
    username: "",
    password: "",
  });

  const hasUsername = useMemo(
    () => formState.values.username.trim().length > 0,
    [formState.values.username],
  );

  const hasPassword = useMemo(
    () => formState.values.password.trim().length > 0,
    [formState.values.password],
  );

  const isPasswordLongEnough = useMemo(
    () => formState.values.password.length >= 8,
    [formState.values.password],
  );

  const canSubmit = hasUsername && hasPassword && isPasswordLongEnough;

  const handleSubmit = () => {
    if (!hasUsername || !hasPassword) {
      Alert.alert(
        content.alerts.missingDetails.title,
        content.alerts.missingDetails.message,
      );
      return;
    }

    if (!isPasswordLongEnough) {
      Alert.alert(
        content.alerts.shortPassword.title,
        content.alerts.shortPassword.message,
      );
      return;
    }

    Alert.alert(content.alerts.success.title, content.alerts.success.message);
    formState.resetForm();
  };

  return {
    values: formState.values,
    canSubmit,
    setFieldValue: formState.setFieldValue,
    handleSubmit,
  };
}
