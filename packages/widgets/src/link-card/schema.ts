import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const linkCardSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["card", "button", "banner"]).default("card"),
  title: z.string().default("My Link"),
  subtitle: z.string().default("Tap to open"),
  url: z.string().default("https://www.notion.so"),
  icon: z.string().default("🔗"),
  showDomain: booleanStr.default("true"),
});

export type LinkCardParams = z.infer<typeof linkCardSchema>;

export const linkCardDefaults: LinkCardParams = linkCardSchema.parse({});
