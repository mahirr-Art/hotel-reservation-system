"use client";

import { useTranslation } from "@/lib/lang";

export default function WhatsAppButton() {
  const { lang } = useTranslation();
  
  const text = lang === "tr"
    ? "Merhaba, Kuzey Feneri Butik Otel hakkında bilgi almak istiyorum."
    : "Hello, I would like to get information about North Lighthouse Boutique Hotel.";

  const link = `https://wa.me/903682710000?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Destek"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 999,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#25D366",
        boxShadow: "0 8px 30px rgba(37, 211, 102, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
      className="whatsapp-btn animate-bounce-slow"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1) translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 35px rgba(37, 211, 102, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(37, 211, 102, 0.45)";
      }}
    >
      {/* WhatsApp SVG Icon */}
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.906-6.99C16.554 1.876 14.079 1.843 12.016 1.843c-5.438 0-9.863 4.42-9.867 9.864 0 1.73.476 3.418 1.378 4.908l-.927 3.39 3.447-.905zm12.338-7.23c-.33-.164-1.954-.964-2.256-1.074-.3-.109-.52-.164-.737.164-.218.327-.844 1.074-1.034 1.293-.19.218-.379.245-.71.082-.33-.164-1.393-.513-2.653-1.638-.98-.874-1.642-1.953-1.834-2.28-.192-.327-.02-.504.145-.667.148-.147.33-.382.495-.573.165-.19.22-.327.33-.546.11-.218.054-.41-.027-.573-.082-.164-.737-1.776-1.01-2.432-.267-.643-.538-.553-.737-.563-.19-.01-.41-.01-.628-.01-.218 0-.573.082-.873.41-.3.327-1.144 1.118-1.144 2.73 0 1.61 1.172 3.166 1.332 3.385.16.218 2.302 3.513 5.576 4.926.779.336 1.386.537 1.86.688.783.249 1.497.214 2.06.13.627-.094 1.954-.8 2.228-1.53.273-.73.273-1.357.19-1.488-.083-.131-.3-.218-.63-.382z" />
      </svg>
      
      {/* Decorative pulse ring */}
      <span
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: "2px solid #25D366",
          opacity: 0.5,
          pointerEvents: "none",
        }}
        className="animate-ping"
      />
    </a>
  );
}
