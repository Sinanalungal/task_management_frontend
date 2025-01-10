import { Geist, Geist_Mono } from "next/font/google";
import  { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Taskify",
  description: "Simplifying Your Workflow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[1800px] mx-auto`}
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      ><Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        className: 'font-semibold font-roboto',
        style: {
          padding: '16px',
        },
      }}
    />
        {children}
      </body>
    </html>
  );
}
