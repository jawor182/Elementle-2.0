import React from "react";

const Header = () => {
    return (
        <div className="bg-slate-500 w-full no-underline h-6">
            <div className="hover:underline no-underline" href="/ranking">Ranking</div>
            <div className="hover:underline " href="/o-nas">O Nas</div>
            <div className="hover:underline " href="/ustawienia">Ustawienia</div>
            <div className="hover:underline " href="/profil">Profil</div>
        </div>
    )
};

export default Header
