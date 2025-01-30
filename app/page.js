import Background from "./_components/Background.jsx";
import Footer from "./_components/Footer.jsx";
import Header from "./_components/Header.jsx";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
            <Header/>
            <Background/>
            <Footer/>
    </div>
  );
}
