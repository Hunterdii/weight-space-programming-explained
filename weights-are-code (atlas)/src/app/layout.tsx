import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import KeyboardGlobal from "@/components/site/KeyboardGlobal";
import ShortcutsSheet from "@/components/site/ShortcutsSheet";
import CommandMenu from "@/components/site/CommandMenu";
import TruthSync from "@/components/site/TruthSync";
import SparsityProgress from "@/components/site/SparsityProgress";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SEO_FAQS } from "@/content/seoFaq";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weight-space-atlas.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0b0e14",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Weight-Space Programming | Interactive Neural Weights Lab",
    template: "%s · Weight-Space Programming",
  },
  description:
    "Explore Weight-Space Programming (WSP): inspect, diagnose, and edit neural network weights directly without gradient descent. Free interactive lab and guide.",
  keywords: [
    "Weight-Space Programming",
    "weight space programming",
    "weight space learning",
    "neural network weight space",
    "mechanistic interpretability interactive lab",
    "neural network weights visualization",
    "sparse autoencoders tutorial",
    "weight space geometry deep learning",
    "transformer weights analysis",
    "interactive machine learning lab",
    "AI model weight inspection",
    "deep learning weight space exploration",
    "open-weights model analysis",
  ],
  authors: [{ name: "Het Patel (Hunterdii)", url: "https://github.com/Hunterdii" }],
  creator: "Het Patel",
  publisher: "Het Patel",
  alternates: {
    canonical: "https://weight-space-atlas.vercel.app/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Weight-Space Programming | Interactive Neural Weights Lab",
    description:
      "Explore Weight-Space Programming (WSP): inspect, diagnose, and edit neural network weights directly without gradient descent. Free interactive lab and guide.",
    url: "https://weight-space-atlas.vercel.app/",
    siteName: "Weight-Space Programming",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Weight-Space Programming - Interactive Neural Weights Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weight-Space Programming | Interactive Neural Weights Lab",
    description:
      "Explore Weight-Space Programming (WSP): inspect, diagnose, and edit neural network weights directly without gradient descent. Free interactive lab and guide.",
    images: ["/og-image.png"],
    creator: "@Hunterdii",
  },
};

const WEB_APP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Weight-Space Programming Interactive Lab",
  url: "https://weight-space-atlas.vercel.app/",
  applicationCategory: "EducationalApplication",
  operatingSystem: "WebBrowser",
  description:
    "Interactive browser-based laboratory and field monograph exploring Weight-Space Programming (WSP), mechanistic interpretability, and zero-gradient neural weight surgery.",
  author: {
    "@type": "Person",
    name: "Het Patel",
    alternateName: "Hunterdii",
    url: "https://github.com/Hunterdii",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Weight-Space Programming: An Independent Field Guide",
  description:
    "13-chapter open interactive curriculum covering neural weight spaces, spatial reading, rank-1 direction surgeries, and mechanistic auditing.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Weight-Space Programming Open Science Project",
    url: "https://weight-space-atlas.vercel.app/",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT4H",
  },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SEO_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answerHtml,
    },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_APP_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <KeyboardGlobal />
          <ShortcutsSheet />
          <CommandMenu />
          <TruthSync />
          <SparsityProgress />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
