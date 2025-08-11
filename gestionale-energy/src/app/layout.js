import React from "react";
import localFont from "next/font/local";
import "./globals.css";

import PropTypes from 'prop-types'; // per ESLint

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Oppimitti Energy G.B",
  description: "Gestionale che automatizza la gestione delle balle",
  icons: {
    icon: "/logoon.ico"
  }
};

// salamaleku

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};