import Footer from "./_components/Footer.jsx";
import Header from "./_components/Header.jsx";
import Image from "next/image.js";
import Link from "next/link.js";

export default async function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="relative flex-1 bg-bgImg bg-repeat bg-cover bg-zinc-500">
        <div className="w-full flex flex-col items-center pt-8">
          <div className="flex items-center justify-center content-center">
            <Image alt="logo gry" src="/logo.png" height={96} width={96} />
            <div
              className="text-8xl  text-transparent bg-clip-text"
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
          <div className="space-y-2 text-white">
            <Link href={"/elementle"}>
              <div className="h-24 w-96 m-8 items-center grid grid-cols-[1fr_3fr] justify-center bg-cyan-700 border-black rounded-xl border-[0.3rem] hover:scale-125 hover:text-orange-200 hover:duration-300 hover:ease-in">
                <div>
                  <Image alt={"logo gry 1"} src={"/1-menu-item.png"} height={72} width={72} className="pl-2"/>
                </div>
                <div className="text-5xl text-left">Elementle</div>
              </div>
            </Link>
             <Link href={"/znajdowanie"}>
              <div className="h-24 w-96 m-8 items-center grid grid-cols-[1fr_3fr] justify-center bg-red-500 border-black rounded-xl border-[0.3rem] hover:scale-125 hover:text-orange-200 hover:duration-300 hover:ease-in">
                <div>
                  <Image alt={"logo gry 2"} src={"/2-menu-item.png"} height={72} width={72} className="pl-2"/>
                </div>
                <div className="text-5xl">Znajdowanie</div>
              </div>
            </Link>
            <Link href={"/uzupelnianie"}>
              <div className="h-24 w-96 m-8 items-center justify-center grid grid-cols-[1fr_3fr] bg-yellow-500 border-black rounded-xl border-[0.3rem] hover:scale-125 hover:text-orange-200 hover:duration-300 hover:ease-in">
                <div>
                  <Image alt={"logo gry 3"} src={"/3-menu-item.png"} height={72} width={72} className="pl-2"/>
                </div>
                <div className="text-5xl">Uzupelnianie</div>
              </div>
            </Link>
            <Link href={"/wlasciwosci"}>
              <div className="h-24 w-96 m-8 grid grid-cols-[1fr_3fr] justify-center items-center  bg-green-500 border-black rounded-xl border-[0.3rem] hover:scale-125 hover:text-orange-200 hover:duration-300 hover:ease-in">
                <div>
                  <Image alt={"logo gry 4"} src={"/4-menu-item.png"} height={72} width={72} className="pl-2"/>
                </div>
                <div className="text-5xl">Wlasciwosci</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
