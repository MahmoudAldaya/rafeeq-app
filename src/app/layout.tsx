import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "رفيق - منصة المنح الدراسية لطلاب غزة",
  description:
    "رفيق منصتك الشاملة للبحث عن المنح الدراسية الدولية والتقديم عليها. خدمات احترافية بأسعار محلية تبدأ من 35₪ فقط.",
  keywords: [
    "منح دراسية",
    "غزة",
    "طلاب فلسطين",
    "دراسة في الخارج",
    "منح ممولة بالكامل",
    "scholarship",
    "Gaza students",
  ],
  openGraph: {
    title: "رفيق - منصة المنح الدراسية لطلاب غزة",
    description:
      "منصتك الشاملة للبحث عن المنح الدراسية الدولية والتقديم عليها",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
