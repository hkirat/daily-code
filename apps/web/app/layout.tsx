import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers, ThemeProvider } from "../components/Providers";
import NextTopLoader from "nextjs-toploader";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";
// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";
// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import { Toaster } from "@repo/ui";

const fontSans = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Projects | 100xDevs",
  description: "Code Daily",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.className} min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextTopLoader color="#2E78C7" height={2} />
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
