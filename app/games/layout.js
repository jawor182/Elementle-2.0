import React from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
export default function GameLayout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header/>
      {children}
      <Footer/>
    </div>
  );
}
