import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Slofy",
  description: "AI-powered code review dashboard",
  icons: "/logo.png",
};

/**
 * Root layout component that wraps page content with global providers and UI scaffolding.
 *
 * Applies site-wide fonts and renders an HTML document shell containing ThemeProvider (defaulting to dark theme with system support),
 * AuthProvider for authentication context, and a Toaster for notifications.
 *
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - The page content to render inside the layout.
 * @returns {JSX.Element} The top-level HTML structure for the application, including providers and toast UI.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          {children}
          <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}