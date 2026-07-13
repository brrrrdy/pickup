import { useState } from "react";
import { Alert, Linking } from "react-native";
import { useForm } from "./use-form";
import {
  buildContactMailtoUrl,
  type ContactFormValues,
} from "../../lib/contact/mail";

// shape of the content object passed in from the page's JSON content file. Keeps all copy and config out of the hook logic.

type ContactFormContent = {
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
      organisation: string;
      email: string;
      message: string;
    };
  };
};

type UseContactFormParams = {
  content: ContactFormContent;
};

// manages state and submission logic for the contact form. composes useForm for field state, adds country selection and policy consent, and handles mailto URL construction and opening.

export function useContactForm({ content }: UseContactFormParams) {
  // generic form state — field values, setter, and reset

  const formState = useForm<ContactFormValues>({
    firstName: "",
    lastName: "",
    organisation: "",
    email: "",
    message: "",
  });

  // user must toggle this before submitting

  const [agreeToPolicies, setAgreeToPolicies] = useState(false);

  // form only submittable when the minimum required fields are filled

  const canSubmit =
    formState.values.firstName.trim().length > 0 &&
    formState.values.email.trim().length > 0;

  const handleSubmit = async () => {
    // block submission if the user hasn't accepted the privacy policy
    if (!agreeToPolicies) {
      Alert.alert(content.alerts.privacy.title, content.alerts.privacy.message);
      return;
    }
    // block submission if required fields are empty
    if (!canSubmit) {
      Alert.alert(
        content.alerts.missingDetails.title,
        content.alerts.missingDetails.message,
      );
      return;
    }
    // build mailto URL from form values and content config
    const mailtoUrl = buildContactMailtoUrl({
      to: content.mail.to,
      defaultSubject: content.mail.defaultSubject,
      bodyLabels: content.mail.bodyLabels,
      form: formState.values,
    });
    // open user's mail client — show error alert if it fails

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
    agreeToPolicies,
    canSubmit,
    setAgreeToPolicies,
    handleSubmit,
  };
}
