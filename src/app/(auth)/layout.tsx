import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social-Media",
  description: "A Next.js 14 Meta Threads Application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`} suppressHydrationWarning={true}>
          <div className="w-full flex justify-center items-center min-h-screen">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
