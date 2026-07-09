export type ContactFormValues = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

type ContactMailBodyLabels = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

type BuildContactMailtoArgs = {
  to: string;
  defaultSubject: string;
  bodyLabels: ContactMailBodyLabels;
  country: string;
  form: ContactFormValues;
};

export function buildContactMailtoUrl({
  to,
  defaultSubject,
  bodyLabels,
  country,
  form,
}: BuildContactMailtoArgs) {
  const subject = encodeURIComponent(
    `${form.firstName || defaultSubject} ${form.lastName}`.trim(),
  );

  const body = encodeURIComponent(
    [
      `${bodyLabels.firstName}: ${form.firstName}`,
      `${bodyLabels.lastName}: ${form.lastName}`,
      `${bodyLabels.company}: ${form.company}`,
      `${bodyLabels.email}: ${form.email}`,
      `${bodyLabels.phone}: ${country} ${form.phone}`,
      "",
      `${bodyLabels.message}:`,
      form.message,
    ].join("\n"),
  );

  return `mailto:${to}?subject=${subject}&body=${body}`;
}
