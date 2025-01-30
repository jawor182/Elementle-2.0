import Link from "next/link";
import React from "react";

const Header = () => {
    return (
        <div className="bg-zinc-800 w-full no-underline h-12 flex justify-around items-center text-white ">
            <Link className="hover:underline hover:text-orange-100" href="/ranking">Ranking</Link>
            <Link className="hover:underline hover:text-orange-100" href="/o-nas">O Nas</Link>
            <Link className="hover:underline hover:text-orange-100" href="/ustawienia">Ustawienia</Link>
            <Link className="hover:underline hover:text-orange-100" href="/profil">Profil</Link>
        </div>
    )
};

export default Header
