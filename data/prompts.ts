export type Locale = "en" | "cs";

export const prompts: Record<
  Locale,
  { character: string[]; setting: string[] }
> = {
  en: {
    character: [
      "Tennis ball",
      "Cactus",
      "The girl from game we did earlier",
      "Yourself",
      "2002 Honda Civic",
      "Your teacher",
      "Three eyed alien slug",
    ],
    setting: [
      "detective",
      "cyberpunk mercenary",
      "medieval knight",
      "space explorer",
      "cowboy",
      "pirate",
    ],
  },
  cs: {
    character: [
      "Tenisák",
      "Kaktus",
      "Dívka ze hry, kterou jsme hráli na začátku",
      "Ty sám/sama",
      "Honda Civic 2002",
      "Tvůj učitel/ka",
      "Tříoký mimozemský slimák",
    ],
    setting: [
      "detektiv",
      "cyberpunkový žoldák",
      "středověký rytíř",
      "vesmírný průzkumník",
      "kovboj",
      "pirát",
    ],
  },
};
