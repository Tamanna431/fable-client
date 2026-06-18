"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

/**
 * GoogleLoginButton
 * Props:
 *  - role: "user" | "writer"  (optional, defaults to "user")
 *  - redirectTo: string       (optional, defaults to "/")
 *  - onSuccess: fn            (optional callback after login)
 */
export default function GoogleLoginButton({ role = "user", redirectTo = "/", onSuccess }) {
  const btnRef = useRef(null);
  const { googleLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const initGoogle = () => {
      if (!window.google || !btnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const user = await googleLogin({
              idToken: response.credential,
              role,
            });
            toast.success(`Welcome, ${user.fullName?.split(" ")[0] || "there"}! 🎉`);
            if (onSuccess) onSuccess(user);
            else router.push(redirectTo);
          } catch (err) {
            toast.error(err?.response?.data?.message || "Google login failed.");
          }
        },
      });

      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: btnRef.current.offsetWidth || 340,
      });
    };

    // Google script might already be loaded or still loading
    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener("load", initGoogle);
        return () => script.removeEventListener("load", initGoogle);
      }
    }
  }, [role, redirectTo, googleLogin, router, onSuccess]);

  return (
    <div
      ref={btnRef}
      className="w-full flex justify-center"
      style={{ minHeight: "44px" }}
    />
  );
}
