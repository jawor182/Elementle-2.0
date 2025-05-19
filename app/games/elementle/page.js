"use client";
import { fetchElementle } from "@/lib/firebase";
import Background from "@/app/_components/Background";
import React, { useEffect, useState } from "react";
import pierwiastkiData from "@/data/pierwiastki";
import WinScreen from "@/app/_components/WinScreen";

const LOCAL_STORAGE_KEY = "elementle-state";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const saveToLocalStorage = (state) => {
    try {
        const stateWithDate = {
            ...state,
            date: getTodayDate(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateWithDate));
    } catch (e) {
        console.warn("Nie udało się zapisać do localStorage:", e);
    }
};

const loadFromLocalStorage = () => {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) return null;

        const parsed = JSON.parse(data);
        const today = getTodayDate();

        if (parsed.date !== today) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return null;
        }

        return parsed;
    } catch (e) {
        console.warn("Nie udało się wczytać z localStorage:", e);
        return null;
    }
};

const Elementle = () => {
    const [inputValue, setInputValue] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [disableInput, setDisableInput] = useState(false);
    const [correctElement, setCorrectElement] = useState(null);
    const [win, setWin] = useState(false);
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inputError, setInputError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const dailyAnswer = await fetchElementle();

                if (!dailyAnswer?.pierwiastek) {
                    throw new Error("Brak danych elementu.");
                }

                const pierwiastkiList = pierwiastkiData || [];
                if (pierwiastkiList.length === 0) {
                    throw new Error("Baza pierwiastków jest pusta.");
                }

                const normalizedElements = pierwiastkiList.map((el) => ({
                    ...el,
                    nazwa: el.nazwa.trim().toLowerCase(),
                }));

                const normalizedAnswer = {
                    ...dailyAnswer.pierwiastek,
                    nazwa: dailyAnswer.pierwiastek.nazwa.trim().toLowerCase(),
                };

                setElements(normalizedElements);
                setCorrectElement(normalizedAnswer);

                const saved = loadFromLocalStorage();
                if (saved && saved.correctName === normalizedAnswer.nazwa) {
                    setGuesses(saved.guesses || []);
                    setWin(saved.win || false);
                    setDisableInput(saved.win || false);
                }
            } catch (error) {
                console.error("Błąd ładowania danych:", error);
                setError("Błąd ładowania gry. Spróbuj odświeżyć stronę.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (correctElement) {
            saveToLocalStorage({
                guesses,
                win,
                correctName: correctElement.nazwa,
            });
        }
    }, [guesses, win, correctElement]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const userGuess = inputValue.trim().toLowerCase();
        if (!userGuess) {
            setInputError("Wpisz nazwę pierwiastka");
            return;
        }

        const userGuessElement = elements.find(
            (element) => element.nazwa === userGuess,
        );

        if (userGuessElement) {
            const isCorrect = userGuessElement.nazwa === correctElement.nazwa;

            if (isCorrect) {
                setWin(true);
                setDisableInput(true);
            }

            setGuesses([...guesses, userGuessElement]);
            setInputValue("");
            setError(null);
            setInputError(null);
        } else {
            setInputError(
                `Nie znaleziono pierwiastka "${inputValue}". Sprawdź pisownię.`,
            );
        }
    };

    const renderWithArrow = (guessValue, correctValue, isMass = false) => {
        const displayGuessValue = isMass
            ? Math.round(Number(guessValue)).toString()
            : guessValue;
        const displayCorrectValue = isMass
            ? Math.round(Number(correctValue)).toString()
            : correctValue;

        if (displayGuessValue === displayCorrectValue) {
            return (
                <span className="text-green-500 font-bold">{displayGuessValue}</span>
            );
        }

        const numGuess = Number(displayGuessValue);
        const numCorrect = Number(displayCorrectValue);

        if (isNaN(numGuess) || isNaN(numCorrect)) {
            return <span className="text-red-400">{displayGuessValue || "-"}</span>;
        }

        if (numGuess > numCorrect) {
            return (
                <div className="flex items-center text-amber-400">
                    {displayGuessValue}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="flex items-center text-amber-400">
                    {displayGuessValue}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="relative h-screen flex items-center justify-center">
                <Background className="absolute inset-0 z-0 object-cover w-full h-full" />
                <div className="relative z-10 text-xl font-semibold text-white bg-blue-600/90 p-6 rounded-lg backdrop-blur-sm">
                    Ładowanie gry...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative h-screen flex items-center justify-center">
                <Background className="absolute inset-0 z-0 object-cover w-full h-full" />
                <div className="relative z-10 text-xl font-semibold text-white bg-red-600/90 p-6 rounded-lg backdrop-blur-sm max-w-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    if (win) {
        return (
            <WinScreen
                attempts={guesses.length}
                gameType="Elementle"
                correctAnswer={
                    correctElement.nazwa.charAt(0).toUpperCase() +
                    correctElement.nazwa.slice(1)
                }
                additionalInfo={{
                    "Masa atomowa": Math.round(correctElement.masaAtomowa),
                    "Rok odkrycia": correctElement.rokOdkrycia,
                    Rodzaj: correctElement.rodzaj,
                    Okres: correctElement.okres,
                }}
            />
        );
    }

    return (
        <div className="relative h-screen overflow-hidden bg-gray-500/20">
            <Background className="absolute inset-0 z-0 object-cover w-full h-full" />

            <div className="relative z-10 h-full flex flex-col items-center p-4">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white border-b border-white/20 w-full max-w-4xl">
                    <div className="flex items-center justify-center space-x-3">
                        <img src="/logo.png" alt="Logo" className="h-10 drop-shadow-lg" />
                        <h1 className="text-2xl font-bold drop-shadow-md text-lime-400">
                            Elementle
                        </h1>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-4 flex items-center justify-center w-full"
                >
                    <div className="w-full max-w-4xl flex items-center">
                        <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                            <img
                                src="/question.svg"
                                alt="?"
                                className="w-6 h-6 filter brightness-0 invert"
                            />
                        </div>
                        <div className="flex-1 w-2/3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setInputError(null);
                                }}
                                placeholder="Wpisz nazwę pierwiastka"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-white bg-white/20 backdrop-blur-sm placeholder-white/70 ${inputError
                                        ? "border-red-400 focus:ring-red-400"
                                        : "border-white/30 focus:ring-blue-400"
                                    }`}
                                disabled={disableInput}
                                autoFocus
                            />
                            {inputError && (
                                <div className="mt-2 text-sm text-red-300 bg-red-900/50 px-3 py-1.5 rounded-md">
                                    {inputError}
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                <div className="overflow-auto flex-1 w-full max-w-4xl">
                    <div className="min-w-full">
                        <div className="grid grid-cols-6 gap-2 p-3 bg-white/10 text-xs font-semibold text-white/80 sticky top-0 backdrop-blur-sm">
                            <div>Nazwa</div>
                            <div>Rodzaj</div>
                            <div>Masa</div>
                            <div>Rok</div>
                            <div>Elektrouj.</div>
                            <div>Okres</div>
                        </div>

                        <div className="divide-y divide-white/10">
                            {guesses.map((guess, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-6 gap-2 p-3 text-sm text-white"
                                >
                                    <div
                                        className={
                                            guess.nazwa === correctElement.nazwa
                                                ? "text-green-400 font-bold"
                                                : "text-red-300"
                                        }
                                    >
                                        {guess.nazwa}
                                    </div>
                                    <div
                                        className={
                                            guess.rodzaj === correctElement.rodzaj
                                                ? "text-green-400 font-bold"
                                                : "text-red-300"
                                        }
                                    >
                                        {guess.rodzaj}
                                    </div>
                                    <div>
                                        {renderWithArrow(
                                            guess.masaAtomowa,
                                            correctElement.masaAtomowa,
                                            true,
                                        )}
                                    </div>
                                    <div>
                                        {renderWithArrow(
                                            guess.rokOdkrycia,
                                            correctElement.rokOdkrycia,
                                        )}
                                    </div>
                                    <div>
                                        {renderWithArrow(
                                            guess.elektroujemnosc,
                                            correctElement.elektroujemnosc,
                                        )}
                                    </div>
                                    <div>
                                        {renderWithArrow(guess.okres, correctElement.okres)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Elementle;
