import Link from 'next/link';
import Image from 'next/image';

const WinScreen = () => {
    const games = [
        {
            name: 'Elementle',
            path: '/games/elementle',
            icon: '/1-menu-item.png',
            color: "bg-cyan-600 hover:bg-cyan-500",
            textColor: "text-cyan-100"
        },
        {
            name: 'Znajdowanie',
            path: '/games/znajdowanie',
            icon: '/2-menu-item.png',
            color: "bg-red-600 hover:bg-red-500",
            textColor: "text-red-100"
        },
        {
            name: 'Uzupełnianie',
            path: '/games/uzupelnianie',
            icon: '/3-menu-item.png',
            color: "bg-yellow-600 hover:bg-yellow-500",
            textColor: "text-yellow-100"
        },
        {
            name: 'Właściwości',
            path: '/games/wlasciwosci',
            icon: '/4-menu-item.png',
            color: "bg-green-600 hover:bg-green-500",
            textColor: "text-green-100"
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="w-full max-w-2xl h-[720px] bg-gradient-to-b from-purple-800 to-purple-900 rounded-xl p-6 shadow-2xl border-2 border-purple-400">
                <h1 className="text-center mt-12 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    Gratulacje!
                </h1>
                <h2 className="text-center text-2xl text-purple-100 mt-4 mb-10">
                    Sprawdź się w innych grach
                </h2>
                
                <div className="space-y-6 mx-auto w-4/5">
                    {games.map((game, index) => (
                        <Link
                            key={index}
                            href={game.path}
                            className={`flex items-center h-24 ${game.color} transition-all duration-300 border-4 border-black/30 text-2xl rounded-xl overflow-hidden hover:scale-105 transform shadow-lg hover:shadow-xl ${game.textColor}`}
                        >
                            <div className="relative h-16 w-16 mx-4 rounded-lg p-1">
                                <Image
                                    src={game.icon}
                                    alt={`Ikona gry ${game.name}`}
                                    fill
                                    className="object-contain drop-shadow-md"
                                    sizes="64px"
                                />
                            </div>
                            <span className="flex-1 text-center pr-6 text-4xl font-semibold text-shadow-md">
                                {game.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinScreen;
