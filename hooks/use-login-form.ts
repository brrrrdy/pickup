import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useAuth } from "../lib/auth/AuthProvider";
import { useForm } from "./use-form";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormContent = {
  errors: {
    missingDetails: { message: string };
    invalidEmail: { message: string };
    shortPassword: { message: string };
    invalidCredentials: { message: string };
    signInFailed: { message: string };
  };
};

type UseLoginFormParams = {
  content: LoginFormContent;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only follow in-app paths, never another site.
export function safeRedirect(redirectTo: string | string[] | undefined) {
  const path = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo;
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  if (path === "/login" || path === "/register") {
    return "/";
  }
  return path;
}

export function useLoginForm({ content }: UseLoginFormParams) {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Shown inline: Alert.alert is a no-op on web.
  const [error, setError] = useState<string | null>(null);

  const formState = useForm<LoginFormValues>({
    email: "",
    password: "",
  });

  const hasEmail = useMemo(
    () => formState.values.email.trim().length > 0,
    [formState.values.email],
  );

  const isEmailValid = useMemo(
    () => EMAIL_PATTERN.test(formState.values.email.trim()),
    [formState.values.email],
  );

  const hasPassword = useMemo(
    () => formState.values.password.trim().length > 0,
    [formState.values.password],
  );

  const isPasswordLongEnough = useMemo(
    () => formState.values.password.length >= 8,
    [formState.values.password],
  );

  const canSubmit =
    hasEmail && hasPassword && isPasswordLongEnough && !isSubmitting;

  const setFieldValue: typeof formState.setFieldValue = (field, value) => {
    setError(null);
    formState.setFieldValue(field, value);
  };

  const handleSubmit = async () => {
    if (!hasEmail || !hasPassword) {
      setError(content.errors.missingDetails.message);
      return;
    }

    if (!isEmailValid) {
      setError(content.errors.invalidEmail.message);
      return;
    }

    if (!isPasswordLongEnough) {
      setError(content.errors.shortPassword.message);
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(
      formState.values.email,
      formState.values.password,
    );
    setIsSubmitting(false);

    if (result.error) {
      setError(
        result.error === "Invalid login credentials"
          ? content.errors.invalidCredentials.message
          : content.errors.signInFailed.message,
      );
      return;
    }

    formState.resetForm();
    router.replace(safeRedirect(redirectTo));
  };

  return {
    values: formState.values,
    canSubmit,
    isSubmitting,
    error,
    setFieldValue,
    handleSubmit,
  };
}
