import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import TailwindIndicator from "@/components/tailwind-indicator";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <TailwindIndicator />
        <Analytics />
        <Component {...pageProps} />
        <Toaster position="top-center" expand visibleToasts={4} />
      </SessionProvider>
    </NextThemesProvider>
  );
};

export default api.withTRPC(MyApp);
