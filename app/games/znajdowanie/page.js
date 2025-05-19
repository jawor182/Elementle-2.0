"use client";
import { useEffect, useState } from "react";
import { fetchElementle } from "@/lib/firebase";
import WinScreen from "@/app/_components/WinScreen";

const LOCAL_STORAGE_KEY = "znajdowanie-state";
const getTodayDate = () => new Date().toISOString().split("T")[0];

const saveToLocalStorage = (state) => {
    try {
        const stateWithDate = { ...state, date: getTodayDate() };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateWithDate));
    } catch (e) {
        console.warn("Nie udało się zapisać stan gry:", e);
    }
};

const loadFromLocalStorage = () => {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data);
        if (parsed.date !== getTodayDate()) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return null;
        }
        return parsed;
    } catch (e) {
        console.warn("Nie udało się wczytać stan gry:", e);
        return null;
    }
};

const Znajdowanie = () => {
    const [inputValue, setInputValue] = useState("");
    const [answerPhrase, setAnswerPhrase] = useState(null);
    const [foundElementsArray, setFoundElementsArray] = useState([]);
    const [win, setWin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchElementle();
                const data = response.zdanie;
                if (!data?.zdanie || !data?.odpowiedzi?.length) {
                    throw new Error("Brak danych do załadowania");
                }

                setAnswerPhrase({ zdanie: data.zdanie, odpowiedzi: data.odpowiedzi });

                // after setting answer, restore saved state
                const saved = loadFromLocalStorage();
                if (saved) {
                    setFoundElementsArray(saved.found || []);
                    setWin(!!saved.win);
                }
            } catch (err) {
                setError(err.message || "Wystąpił nieznany błąd");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!answerPhrase) return;
        saveToLocalStorage({ found: foundElementsArray, win });
    }, [foundElementsArray, win, answerPhrase]);

    useEffect(() => {
        if (foundElementsArray.length >= 10) {
            setWin(true);
        }
    }, [foundElementsArray]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        if (!answerPhrase || win) return;

        const regex = new RegExp("^[\\p{L}]+$", "u");
        const guess = inputValue.match(regex)?.[0];
        if (!guess) return;

        if (!foundElementsArray.includes(guess)) {
            if (answerPhrase.odpowiedzi.includes(guess)) {
                setFoundElementsArray((prev) => [...prev, guess]);
            }
        }
        setInputValue("");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Ładowanie...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgImg bg-cover bg-fixed bg-no-repeat flex flex-col items-center justify-center p-4 gap-6">
            {win && <WinScreen />}

            <header className="flex flex-col justify-center items-center gap-4 w-full max-w-md text-center">
                <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text font-extrabold">
                    Znajdowanie
                </h2>
            </header>

            <div className="w-full max-w-4xl min-h-[300px] bg-gradient-to-b from-green-600 to-green-800 rounded-lg shadow-xl p-8 grid gap-6">
                <div className="flex flex-col items-center justify-center gap-6">
                    <p className="text-xl md:text-2xl text-center text-white font-medium">
                        {answerPhrase.zdanie}
                    </p>

                    <form onSubmit={handleAnswerSubmit} className="w-full max-w-lg">
                        <input
                            required
                            type="text"
                            name="odpowiedz"
                            className="w-full px-6 py-3 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
                            placeholder="Podaj ukryty element w zdaniu"
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={win}
                        />
                    </form>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white">
                    <div className="text-lg md:text-xl">Znalezione pierwiastki:</div>
                    <div className="text-lg md:text-xl font-semibold">
                        {foundElementsArray.length}/10
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {foundElementsArray.map((element, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-sm bg-emerald-700 text-white font-semibold rounded-full shadow-md transition duration-300 transform hover:scale-105"
                            >
                                {element}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Znajdowanie;
