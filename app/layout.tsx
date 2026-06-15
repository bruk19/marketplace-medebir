import type { Metadata } from "next";
import QueryProvider from "@/src/components/quer-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "medebir marketplace",
  description:
    "A public e-commerce platform showcasing local shops and their products with interactive listings and detailed views.",
  authors: [{ name: "Medebir" }],
  openGraph: {
    title: "medebir marketplace",
    description:
      "A public e-commerce platform showcasing local shops and their products with interactive listings and detailed views.",
    type: "website",
    images: ["https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/...png"],
  },
  twitter: {
    card: "summary",
    site: "@Medebir",
    title: "medebir marketplace",
    description:
      "A public e-commerce platform showcasing local shops and their products with interactive listings and detailed views.",
    images: ["https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/...png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
