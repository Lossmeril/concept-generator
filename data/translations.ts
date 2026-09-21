import type { Locale } from "@/data/prompts";

export const translations: Record<
  Locale,
  {
    title: string;
    connector: string;
    characterPlaceholder: string;
    settingPlaceholder: string;
    generate: string;
    generating: string;
  }
> = {
  en: {
    title: "Your concept for concept art is",
    connector: "imagined as a",
    characterPlaceholder: "Character",
    settingPlaceholder: "Setting",
    generate: "Generate concept",
    generating: "Generating...",
  },
  cs: {
    title: "Tvůj koncept pro concept art je",
    connector: "který/á je",
    characterPlaceholder: "Postava",
    settingPlaceholder: "styl",
    generate: "Vygenerovat koncept",
    generating: "Generuji...",
  },
};
