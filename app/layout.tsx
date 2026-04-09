import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendor Management System",
  description: "Enterprise Vendor Portal Management System",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-sans antialiased text-foreground bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-white focus:text-zinc-950 focus:border-2 focus:border-zinc-950 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-[10px] tracking-widest outline-none"
          >
            Skip_to_Content_
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
