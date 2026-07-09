import { useMemo, useState } from "react";
import { Alert, Linking } from "react-native";
import { useForm } from "./use-form";
import {
  buildContactMailtoUrl,
  type ContactFormValues,
} from "../../lib/contact/mail";

type ContactFormContent = {
  countryOptions: string[];
  alerts: {
    privacy: { title: string; message: string };
    missingDetails: { title: string; message: string };
    mailError: { title: string; message: string };
  };
  mail: {
    to: string;
    defaultSubject: string;
    bodyLabels: {
      firstName: string;
      lastName: string;
      company: string;
      email: string;
      phone: string;
      message: string;
    };
  };
};

type UseContactFormParams = {
  content: ContactFormContent;
};

export function useContactForm({ content }: UseContactFormParams) {
  const formState = useForm<ContactFormValues>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const [country, setCountry] = useState(content.countryOptions[0] ?? "US");
  const [agreeToPolicies, setAgreeToPolicies] = useState(false);

  const canSubmit = useMemo(
    () =>
      formState.values.firstName.trim().length > 0 &&
      formState.values.email.trim().length > 0,
    [formState.values.email, formState.values.firstName],
  );

  const handleSubmit = async () => {
    if (!agreeToPolicies) {
      Alert.alert(content.alerts.privacy.title, content.alerts.privacy.message);
      return;
    }

    if (!canSubmit) {
      Alert.alert(
        content.alerts.missingDetails.title,
        content.alerts.missingDetails.message,
      );
      return;
    }

    const mailtoUrl = buildContactMailtoUrl({
      to: content.mail.to,
      defaultSubject: content.mail.defaultSubject,
      bodyLabels: content.mail.bodyLabels,
      country,
      form: formState.values,
    });

    try {
      await Linking.openURL(mailtoUrl);
    } catch {
      Alert.alert(
        content.alerts.mailError.title,
        content.alerts.mailError.message,
      );
    }
  };

  return {
    values: formState.values,
    setFieldValue: formState.setFieldValue,
    resetForm: formState.resetForm,
    country,
    agreeToPolicies,
    canSubmit,
    setCountry,
    setAgreeToPolicies,
    handleSubmit,
  };
}
