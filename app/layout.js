import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Kul-si Marketplace",
  description: "Classifieds for Syria & the Middle East"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Navbar />
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
