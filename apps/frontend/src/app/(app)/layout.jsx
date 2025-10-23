import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { FloatingDockDemo } from "@/components/floating-dock";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EditorProvider } from "@/context/EditorContext";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <EditorProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            {/* 🧩 SidebarTrigger placed OVER the rendered content */}
            <div className="relative min-h-screen w-full">
              <SidebarTrigger className="absolute top-3 left-3 z-50 bg-transparent hover:bg-white/10 p-2 rounded-lg" />
              {children}
              <Toaster richColors />
              <FloatingDockDemo />
            </div>
          </SidebarProvider>
          </EditorProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
