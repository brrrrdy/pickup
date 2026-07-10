import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useForm } from "./use-form";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormContent = {
  alerts: {
    missingDetails: { title: string; message: string };
    passwordMismatch: { title: string; message: string };
    shortPassword: { title: string; message: string };
    consentRequired: { title: string; message: string };
    success: { title: string; message: string };
  };
};

type UseRegisterFormParams = {
  content: RegisterFormContent;
};

export function useRegisterForm({ content }: UseRegisterFormParams) {
  const formState = useForm<RegisterFormValues>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeToPolicies, setAgreeToPolicies] = useState(false);

  const allFieldsFilled = useMemo(
    () =>
      Object.values(formState.values).every((value) => value.trim().length > 0),
    [formState.values],
  );

  const isPasswordLongEnough = useMemo(
    () => formState.values.password.length >= 8,
    [formState.values.password],
  );

  const passwordsMatch = useMemo(
    () =>
      formState.values.password.length > 0 &&
      formState.values.password === formState.values.confirmPassword,
    [formState.values.confirmPassword, formState.values.password],
  );

  const canSubmit =
    allFieldsFilled &&
    isPasswordLongEnough &&
    passwordsMatch &&
    agreeToPolicies;

  const handleSubmit = () => {
    if (!allFieldsFilled) {
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

    if (!passwordsMatch) {
      Alert.alert(
        content.alerts.passwordMismatch.title,
        content.alerts.passwordMismatch.message,
      );
      return;
    }

    if (!agreeToPolicies) {
      Alert.alert(
        content.alerts.consentRequired.title,
        content.alerts.consentRequired.message,
      );
      return;
    }

    Alert.alert(content.alerts.success.title, content.alerts.success.message);
    formState.resetForm();
    setAgreeToPolicies(false);
  };

  return {
    values: formState.values,
    setFieldValue: formState.setFieldValue,
    agreeToPolicies,
    canSubmit,
    setAgreeToPolicies,
    handleSubmit,
  };
}
