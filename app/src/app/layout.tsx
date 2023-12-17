import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "tailwindcss/tailwind.css";

export const metadata = {
  title: "Dental Clutter | Organized Files for Streamlined Smiles",
  description:
    "DentalClutter is an efficient, secure, and space-saving management solution for dental records and models.",
};

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID;

const Layout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className="h-full bg-white">
    <body className="h-full">
      {children}
      <Analytics />
      <SpeedInsights />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </body>
  </html>
);

export default Layout;
