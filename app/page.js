import fetchData from "@/lib/firebase.js";
import Background from "./_components/Background.jsx";
import Footer from "./_components/Footer.jsx";
import Header from "./_components/Header.jsx";
import Image from "next/image.js";

export default function Home() {
  //fetchData();
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="relative flex-1">
        <Background />
        <div className="absolute z-50 top-0 left-0 w-full flex flex-col items-center pt-24">
          <div className="flex items-center justify-center content-center">
            <Image
              alt="logo gry"
              src="/logo.png"
              height={96}
              width={96}
              
            />
            <div
              className="text-9xl  text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #06b6d4, #ef4444, #facc15, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Elementle
            </div>
          </div>

          <div className="mt-4 space-y-2 text-white">
            <div>Blok1</div>
            <div>Blok1</div>
            <div>Blok1</div>
            <div>Blok1</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
