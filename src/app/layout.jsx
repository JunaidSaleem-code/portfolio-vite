import "./globals.css";
import "@/lib/env";
import VisitTracker from "@/components/VisitTracker";
import ThemeProvider from "@/components/ThemeProvider";
import { siteUrl } from "@/lib/env";

const SITE = siteUrl();
const TITLE = "Junaid Saleem — AI-focused Full-Stack Engineer";
const DESCRIPTION =
  "Portfolio of Junaid Saleem — AI-focused Full-Stack Engineer specializing in RAG pipelines, LLM integration, and production-grade web & mobile applications.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: "%s · Junaid Saleem",
  },
  description: DESCRIPTION,
  applicationName: "Junaid Saleem · Portfolio",
  authors: [{ name: "Junaid Saleem" }],
  creator: "Junaid Saleem",
  keywords: [
    "Junaid Saleem",
    "AI engineer",
    "RAG",
    "LLM",
    "Full-Stack Developer",
    "Next.js",
    "MongoDB",
    "Pakistan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Junaid Saleem",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.ico" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Junaid Saleem",
  alternateName: "Choudhary Muhammad Junaid",
  url: SITE,
  jobTitle: "AI-focused Full-Stack Engineer",
  worksFor: { "@type": "Organization", name: "Vanar" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Lahore Garrison University" },
  knowsAbout: [
    "Retrieval-Augmented Generation",
    "Large Language Models",
    "Full-Stack Web Development",
    "Next.js",
    "MongoDB",
    "Mobile Development",
  ],
  address: { "@type": "PostalAddress", addressCountry: "PK" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <VisitTracker />
        </ThemeProvider>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
