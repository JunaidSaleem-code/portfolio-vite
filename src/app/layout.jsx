import "./globals.css";
import "@/lib/env";
import VisitTracker from "@/components/VisitTracker";

export const metadata = {
  title: "Junaid Saleem",
  description: "Portfolio of Junaid Saleem — JavaScript / React / Next.js developer based in Lahore, Pakistan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VisitTracker />
      </body>
    </html>
  );
}
