"use client";

import { useState, useEffect } from "react";
import { translations } from "./translations";

export function useTranslation() {
  const [lang, setLangState] = useState<"tr" | "en">("tr");

  useEffect(() => {
    // Read from localStorage on client side
    const saved = localStorage.getItem("lang") as "tr" | "en";
    if (saved) {
      setLangState(saved);
    }

    const handleLangChange = (e: CustomEvent) => {
      setLangState(e.detail);
    };

    window.addEventListener("langChange", handleLangChange as EventListener);
    return () => window.removeEventListener("langChange", handleLangChange as EventListener);
  }, []);

  const changeLanguage = (newLang: "tr" | "en") => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
    window.dispatchEvent(new CustomEvent("langChange", { detail: newLang }));
  };

  const t = translations[lang] || translations.tr;

  return { lang, changeLanguage, t };
}
