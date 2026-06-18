"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <HeroUIProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e1245",
                color: "#f8fafc",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "10px",
              },
              success: {
                iconTheme: { primary: "#a855f7", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />
        </AuthProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
