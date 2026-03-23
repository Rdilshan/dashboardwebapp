import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Module Portal",
  description: "Industrial training portal for students and coordinators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
