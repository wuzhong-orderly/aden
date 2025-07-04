import { useTranslation } from "@orderly.network/i18n";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === "en" ? "ko" : "en";
    
    i18n.changeLanguage(nextLang);
    
    localStorage.setItem("lang", nextLang);
  };

  return (
    <button
      onClick={handleLanguageToggle}
      type="button"
      className="oui-px-3 oui-py-1.5 oui-text-black oui-font-bold hover:oui-opacity-80 oui-rounded-lg oui-border oui-border-line oui-transition-all oui-text-sm"
      style={{ backgroundColor: "#fdb41d", color: "black" }}
    >
      {i18n.language === "en" ? "한국어" : "English"}
    </button>
  );
} 