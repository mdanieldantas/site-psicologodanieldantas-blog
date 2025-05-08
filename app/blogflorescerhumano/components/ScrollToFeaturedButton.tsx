"use client";
import React from "react";

export default function ScrollToFeaturedButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const handleClick = () => {
    const el = document.getElementById("featured-articles");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <button
      aria-label="Rolar para ver mais conteúdo"
      className={className}
      id="scroll-indicator-button"
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
