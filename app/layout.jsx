import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "./context/UserContext";

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
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
