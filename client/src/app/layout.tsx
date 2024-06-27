import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./Markdown.css"
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "brackets",
  description: "brackets is a community for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Toaster />
        <QueryProvider>
          <ReactQueryDevtools />
            {children}
        </QueryProvider>
      </body>
    </html>
  );
}
