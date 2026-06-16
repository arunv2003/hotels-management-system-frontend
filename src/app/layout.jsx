import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";
const inter = Inter({
    subsets: ["latin"],
});
export const metadata = {
    title: "HotelFlow | Scalable Hotel Management SaaS",
    description: "Advanced Multi-Tenant Hotel Management Platform",
};
import { OnboardingProvider } from "@/context/OnboardingContext";
export default function RootLayout({ children, }) {
    return (<html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <GoogleMapsProvider>
              <TooltipProvider>
                <OnboardingProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </OnboardingProvider>
              </TooltipProvider>
            </GoogleMapsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>);
}
