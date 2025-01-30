import React from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import Background from "../_components/Background";
export default function GameLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      {children}
      <Background/>
      <Footer/>
    </div>
  );
}
