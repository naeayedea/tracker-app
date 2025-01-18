import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import "./globals.css";
import React from "react";
import { TrackerProvider } from "@/contexts/TrackerContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Tracker Tracking",
    description: "A generic tracker app with support with multiple trackers and statistics",
};

export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 h-svh`}>
        <TrackerProvider>
            {children}
        </TrackerProvider>
        </body>
        </html>
    )
}

