import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./context/themeContect";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Prestige Gym",
  description: "Train with purpose, transform with pride.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
