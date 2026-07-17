import { Image, Linking, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { PageBody, PageSmall } from "../typography/Typography";
import type {
  RichContentBlock,
  RichContentImageMap,
} from "../../types/rich-content";

type RichTextSectionProps = {
  blocks: RichContentBlock[];
  images?: RichContentImageMap;
  className?: string;
  paragraphClassName?: string;
  imageClassName?: string;
  captionClassName?: string;
};

export default function RichTextSection({
  blocks,
  images = {},
  className = "",
  paragraphClassName = "",
  imageClassName = "",
  captionClassName = "",
}: RichTextSectionProps) {
  return (
    <View className={twMerge("w-full gap-4", className)}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <PageBody key={`paragraph-${index}`} className={paragraphClassName}>
              {block.text}
            </PageBody>
          );
        }

        if (block.type === "indentedParagraph") {
          const hasLink = Boolean(block.linkText && block.linkHref);
          const linkStartIndex = hasLink
            ? block.text.indexOf(block.linkText as string)
            : -1;

          if (hasLink && linkStartIndex >= 0) {
            const linkText = block.linkText as string;
            const prefix = block.text.slice(0, linkStartIndex);
            const suffix = block.text.slice(linkStartIndex + linkText.length);

            return (
              <PageBody
                key={`indented-paragraph-${index}`}
                className={twMerge("pl-5", paragraphClassName)}
              >
                {prefix}
                <Text
                  className="underline"
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(block.linkHref as string)}
                >
                  {linkText}
                </Text>
                {suffix}
              </PageBody>
            );
          }

          return (
            <PageBody
              key={`indented-paragraph-${index}`}
              className={twMerge("pl-5", paragraphClassName)}
            >
              {block.text}
            </PageBody>
          );
        }

        const source = images[block.imageKey];

        if (!source) {
          return null;
        }

        return (
          <View key={`image-${index}`} className="w-full gap-2">
            <View
              className={twMerge(
                "w-full overflow-hidden rounded-lg",
                imageClassName,
              )}
              style={{ aspectRatio: block.aspectRatio ?? 16 / 9 }}
            >
              <Image
                source={source}
                resizeMode={block.resizeMode ?? "cover"}
                accessibilityLabel={block.alt}
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            {block.caption ? (
              <PageSmall
                className={twMerge(
                  "text-center text-defaulttext/70",
                  captionClassName,
                )}
              >
                {block.caption}
              </PageSmall>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
