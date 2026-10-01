import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "./providers/QueryProvider";
import StoreProvider from "@/store/storeProvider";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <QueryProvider>
            {children}

            {/* Existing Sonner */}
            <Toaster richColors position="top-right" />

            {/* React Toastify */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}