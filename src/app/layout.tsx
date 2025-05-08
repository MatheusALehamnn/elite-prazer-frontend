import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as a common, clean font
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext"; // Assuming AuthContext.tsx is created/adapted
import { Toaster } from "@/components/ui/toaster"; // For toast notifications

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Elite Prazer - Conexões Exclusivas",
  description: "Plataforma web responsiva, segura e de alta usabilidade que conecte clientes a acompanhantes premium.",
  // Add more metadata like icons, open graph, etc. later as needed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 pt-20 pb-8 md:pt-24">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

