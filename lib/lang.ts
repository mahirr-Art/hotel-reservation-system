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
      // Synchronize cookie with localStorage
      if (!document.cookie.includes(`lang=${saved}`)) {
        document.cookie = `lang=${saved}; path=/; max-age=31536000; SameSite=Lax`;
        // Trigger a page refresh on initial mismatch to render Server Components in correct language
        window.location.reload();
      }
    } else {
      // Default to cookie if it exists
      const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);
      if (match && (match[1] === "tr" || match[1] === "en")) {
        setLangState(match[1] as "tr" | "en");
        localStorage.setItem("lang", match[1]);
      }
    }

    const handleLangChange = (e: CustomEvent) => {
      setLangState(e.detail);
    };

    window.addEventListener("langChange", handleLangChange as EventListener);
    return () => window.removeEventListener("langChange", handleLangChange as EventListener);
  }, []);

  const changeLanguage = (newLang: "tr" | "en") => {
    localStorage.setItem("lang", newLang);
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    setLangState(newLang);
    window.dispatchEvent(new CustomEvent("langChange", { detail: newLang }));
    // Reload page so Server Components immediately re-render with the new cookie
    window.location.reload();
  };

  const t = translations[lang] || translations.tr;

  return { lang, changeLanguage, t };
}
