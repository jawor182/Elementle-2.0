import "./globals.css";
import { Roboto } from "next/font/google";

export const metadata = {
    title: "Elementle",
    description: "Elementle",
    icons: {
        icon: "/logo.png", 
    },
};

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={roboto.className}>{children}</body>
        </html>
    );
}
