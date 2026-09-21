"use client";

import { useLanguage } from "@/app/language-context";
import type { Locale } from "@/data/prompts";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "cs", label: "CS" },
];

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed right-4 top-4 z-30 flex gap-1 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
      {OPTIONS.map((option) => (
        <button
          key={option.locale}
          onClick={() => setLocale(option.locale)}
          aria-pressed={locale === option.locale}
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition ${
            locale === option.locale
              ? "bg-white text-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
