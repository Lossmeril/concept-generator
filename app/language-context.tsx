"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { Locale } from "@/data/prompts";
import { translations } from "@/data/translations";

const STORAGE_KEY = "locale";

type Listener = () => void;

let locale: Locale = "en";
let initialized = false;
const listeners = new Set<Listener>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "cs") {
    locale = stored;
  } else if (navigator.language.toLowerCase().startsWith("cs")) {
    locale = "cs";
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  ensureInitialized();
  return locale;
}

function getServerSnapshot(): Locale {
  return "en";
}

function setLocale(next: Locale) {
  locale = next;
  initialized = true;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslations() {
  const { locale } = useLanguage();
  return translations[locale];
}
