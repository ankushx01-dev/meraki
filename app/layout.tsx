import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const merakiSans = localFont({
  src: [
    {
      path: "./fonts/SegoeUI-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/SegoeUI-Bold.ttf",
      style: "normal",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-meraki-sans",
});

const merakiDisplay = localFont({
  src: [
    {
      path: "./fonts/Bahnschrift.ttf",
      style: "normal",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-meraki-display",
});

export const metadata: Metadata = {
  title: {
    default: "Meraki",
    template: "%s | Meraki",
  },
  description: "Smart Gym Tracker",
  icons: {
    icon: "/logo.svg", // ✅ using your svg logo
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${merakiSans.variable} ${merakiDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
