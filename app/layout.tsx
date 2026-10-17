import type { Metadata } from "next";
import { profileData } from "@/config/profileData";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profileData.name} — ${profileData.role}`,
  description: profileData.intro,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
