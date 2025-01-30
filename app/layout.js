import "./globals.css"
import { Roboto } from "next/font/google"

export const metadata = {
  title: "Elementle",
  description: "Elementle",
};

const roboto = Roboto({subsets:['latin'], weight:"400"});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="logo.png"/>
      <body className={roboto.className}>
        {children}
        </body>
    </html>
  );
}
