import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Fable – Discover & Read Original Ebooks",
  description:
    "Fable is a digital platform connecting ebook lovers with talented writers. Browse, discover, and read original ebooks from emerging authors worldwide.",
  keywords: "ebooks, reading, writers, digital books, online library, fable",
  authors: [{ name: "Fable Platform" }],
  openGraph: {
    title: "Fable – Ebook Sharing Platform",
    description: "Discover & Read Original Ebooks from talented writers",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Google Identity Services */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="bg-[#0f0a1e] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
