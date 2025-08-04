import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavLink from "@/app/NavLink";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
   icons: {
    icon: "/jbp.png",
  },
  title: "JBP Talks Genesis",
  description: "Jordan B. Peterson gives a Carl Jungian interpretation of the Book of Genesis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col antialiased`}
      >
        <header className="text-sm font-medium">
          <div className="mx-auto flex max-w-6xl gap-4 px-4 py-4">
            <NavLink
              className="text-gray-400 data-[active]:text-gray-900"
              href="/"
            >
              Lecture Q & A
            </NavLink>
            <NavLink
              className="text-gray-400 data-[active]:text-gray-900"
              href="/chat"
            >
              Chat
            </NavLink>

            <div className="ml-auto">
              <a
                href="https://github.com/JZenon13/jbp-rag-chatbot"
                className="text-gray-500 hover:text-gray-900"
              >
                <GitHubLogoIcon width="20" height="20" />
              </a>
            </div>
          </div>
        </header>

        <main className="flex grow flex-col">{children}</main>
      </body>
    </html>
  );
}
