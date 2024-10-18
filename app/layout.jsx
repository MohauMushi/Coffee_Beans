import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "./context/UserContext";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Coffee & Beans",
  description:
    "A curated selection of premium coffee beans from around the world",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Coffee&Beans",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <UserProvider>{children}</UserProvider>
        <Footer />
      </body>
    </html>
  );
}
