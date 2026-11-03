import { buildContactMailtoUrl } from "../../lib/contact/mail";

const bodyLabels = {
  firstName: "first name",
  lastName: "last name",
  organisation: "organisation",
  email: "email",
  message: "message",
};

describe("buildContactMailtoUrl", () => {
  it("builds an encoded mailto url from the form values", () => {
    const url = buildContactMailtoUrl({
      to: "hello@example.com",
      defaultSubject: "enquiry",
      bodyLabels,
      form: {
        firstName: "Ana",
        lastName: "López",
        organisation: "",
        email: "ana@example.com",
        message: "hi & bye",
      },
    });

    expect(url.startsWith("mailto:hello@example.com?subject=")).toBe(true);

    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Ana López");
    expect(params.get("body")).toContain("email: ana@example.com");
    expect(params.get("body")).toContain("hi & bye");
  });

  it("falls back to the default subject when first name is empty", () => {
    const url = buildContactMailtoUrl({
      to: "hello@example.com",
      defaultSubject: "enquiry",
      bodyLabels,
      form: {
        firstName: "",
        lastName: "",
        organisation: "",
        email: "",
        message: "",
      },
    });

    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("enquiry");
  });
});
