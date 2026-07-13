export type ContactFormValues = {
  firstName: string;
  lastName: string;
  organisation: string;
  email: string;
  message: string;
};

type ContactMailBodyLabels = {
  firstName: string;
  lastName: string;
  organisation: string;
  email: string;
  message: string;
};

type BuildContactMailtoArgs = {
  to: string;
  defaultSubject: string;
  bodyLabels: ContactMailBodyLabels;
  form: ContactFormValues;
};

export function buildContactMailtoUrl({
  to,
  defaultSubject,
  bodyLabels,
  form,
}: BuildContactMailtoArgs) {
  const subject = encodeURIComponent(
    `${form.firstName || defaultSubject} ${form.lastName}`.trim(),
  );

  const body = encodeURIComponent(
    [
      `${bodyLabels.firstName}: ${form.firstName}`,
      `${bodyLabels.lastName}: ${form.lastName}`,
      `${bodyLabels.organisation}: ${form.organisation}`,
      `${bodyLabels.email}: ${form.email}`,
      "",
      `${bodyLabels.message}:`,
      form.message,
    ].join("\n"),
  );

  return `mailto:${to}?subject=${subject}&body=${body}`;
}
