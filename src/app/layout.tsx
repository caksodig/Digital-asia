import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Articles - Blog Genzel",
    template: "%s | Blog Genzel",
  },
  description: "Your daily dose of design insights!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${archivo.variable} antialiased`}>
        {/* <AuthProvider><AuthProvider/>  */}
        {children}
      </body>
    </html>
  );
}
