"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_AUTH_CLIENT_ID ?? ""}
          >
            <div
              className="
            min-h-screen 
            mx-auto 
            my-2.5 md:my-4 lg:my-8
            px-4 sm:px-6 md:px-8 
            max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1920px]
          "
            >
              {children}
              <Toaster position="top-right" />
              <Footer />
            </div>
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
