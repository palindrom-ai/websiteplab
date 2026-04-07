import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PHProvider } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cortex by Progression Labs — Auto-Improving Context Graphs for Enterprise",
  description:
    "Cortex captures decision traces to build self-improving context graphs that automate enterprise workflows. Built by Progression Labs.",
  openGraph: {
    title: "Cortex by Progression Labs — Auto-Improving Context Graphs for Enterprise",
    description: "The context layer your AI agents actually need. Capture decision traces. Automate workflows.",
    type: "website",
    url: "https://progressionlabs.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pl-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}
