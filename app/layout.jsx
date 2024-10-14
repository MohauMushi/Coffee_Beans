import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Coffee & Beans",
  description:
    "A curated selection of premium coffee beans from around the world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
