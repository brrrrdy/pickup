import type { ImageSourcePropType } from "react-native";

export type RichParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type RichIndentedParagraphBlock = {
  type: "indentedParagraph";
  text: string;
  linkText?: string;
  linkHref?: string;
};

export type RichImageBlock = {
  type: "image";
  imageKey: string;
  alt: string;
  caption?: string;
  aspectRatio?: number;
  resizeMode?: "cover" | "contain";
};

export type RichContentBlock =
  | RichParagraphBlock
  | RichIndentedParagraphBlock
  | RichImageBlock;

export type RichContentImageMap = Record<string, ImageSourcePropType>;
