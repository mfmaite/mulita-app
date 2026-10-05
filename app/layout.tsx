import type { Metadata, Viewport } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const title = "Mulita · Tus cuentas claras, y tá.";
const description =
  "Anotá tus gastos, armá tu presupuesto, seguí las cuotas de la tarjeta y juntá para tus metas. Finanzas personales a la uruguaya, sin planillas eternas.";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl ? `https://${productionUrl}` : "http://localhost:3000"),
  title: {
    default: title,
    template: "%s · Mulita",
  },
  description,
  applicationName: "Mulita",
  keywords: ["finanzas personales", "presupuesto", "gastos", "ahorro", "cuotas", "tarjeta de crédito", "Uruguay"],
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: "Mulita",
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  appleWebApp: { title: "Mulita" },
};

export const viewport: Viewport = {
  themeColor: "#234B40",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-UY" className={`${baloo.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
