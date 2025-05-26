"use client";

import React from "react";
import { WhatsAppModalProvider } from "@/components/whatsapp-modal-context";

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return (
    <WhatsAppModalProvider>
      {children}
    </WhatsAppModalProvider>
  );
}
