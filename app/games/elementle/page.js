"use client";
import { fetchElementle } from "@/lib/firebase";
import Background from "@/app/_components/Background";
import React, { useEffect, useState } from "react";
import pierwiastkiData from "@/data/pierwiastki";

const Elementle = () => {
    const [inputValue, setInputValue] = useState('');
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
                    throw new Error('Brak danych elementu.');
                }

                const pierwiastkiList = pierwiastkiData || [];
                if (pierwiastkiList.length === 0) {
                    throw new Error('Baza pierwiastków jest pusta.');
                }

                const normalizedElements = pierwiastkiList.map(el => ({
                    ...el,
                    nazwa: el.nazwa.trim().toLowerCase()
                }));

                setElements(normalizedElements);
                setCorrectElement({
                    ...dailyAnswer.pierwiastek,
                    nazwa: dailyAnswer.pierwiastek.nazwa.trim().toLowerCase()
                });
            } catch (error) {
                console.error("Błąd ładowania danych:", error);
                setError("Błąd ładowania gry. Spróbuj odświeżyć stronę.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const userGuess = inputValue.trim().toLowerCase();
        if (!userGuess) {
            setInputError("Wpisz nazwę pierwiastka");
            return;
        }

        const userGuessElement = elements.find(element => 
            element.nazwa === userGuess
        );

        if (userGuessElement) {
            const isCorrect = userGuessElement.nazwa === correctElement.nazwa;
            
            if (isCorrect) {
                setWin(true);
                setDisableInput(true);
            }

            setGuesses([...guesses, userGuessElement]);
            setInputValue('');
            setError(null);
            setInputError(null);
        } else {
            setInputError(`Nie znaleziono pierwiastka "${inputValue}". Sprawdź pisownię.`);
        }
    };

    const renderWithArrow = (guessValue, correctValue, isMass = false) => {
        const displayGuessValue = isMass ? Math.round(Number(guessValue)).toString() : guessValue;
        const displayCorrectValue = isMass ? Math.round(Number(correctValue)).toString() : correctValue;

        if (displayGuessValue === displayCorrectValue) {
            return <span className="text-green-500 font-bold">{displayGuessValue}</span>;
        }

        const numGuess = Number(displayGuessValue);
        const numCorrect = Number(displayCorrectValue);
        
        if (isNaN(numGuess) || isNaN(numCorrect)) {
            return <span className="text-red-400">{displayGuessValue || '-'}</span>;
        }

        if (numGuess > numCorrect) {
            return (
                <div className="flex items-center text-amber-400">
                    {displayGuessValue}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="flex items-center text-amber-400">
                    {displayGuessValue}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
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

    return (
        <div className="relative h-screen overflow-hidden bg-gray-500/20">
            <Background className="absolute inset-0 z-0 object-cover w-full h-full" />
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                {/* Ekran wygranej */}
                {win && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
                        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center overflow-hidden animate-zoomIn">
                            {/* Confetti effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                {[...Array(30)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 0.5}s`,
                                            transform: `rotate(${Math.random() * 360}deg)`,
                                            opacity: 0.7
                                        }}
                                    />
                                ))}
                            </div>
                            
                            {/* Trophy icon */}
                            <div className="relative z-10 mb-6 flex justify-center">
                                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-5 rounded-full shadow-lg animate-bounce">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-16 w-16" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 7h1m-1 5h1m-9 5h1m4 0h1m-7 0h1m-3 0h1" 
                                        />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title */}
                            <h2 className="relative z-10 text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                                Gratulacje!
                            </h2>
                            
                            {/* Subtitle */}
                            <p className="relative z-10 text-lg mb-6 text-white/90">
                                Odgadłeś dzisiejszy pierwiastek w {guesses.length} próbach!
                            </p>
                            
                            {/* Correct element */}
                            <div className="relative z-10 bg-white/10 p-4 rounded-lg backdrop-blur-sm mb-6">
                                <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                                    {correctElement.nazwa.charAt(0).toUpperCase() + correctElement.nazwa.slice(1)}
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Masa atomowa: <span className="font-bold">{Math.round(correctElement.masaAtomowa)}</span></div>
                                    <div>Rok odkrycia: <span className="font-bold">{correctElement.rokOdkrycia}</span></div>
                                    <div>Rodzaj: <span className="font-bold">{correctElement.rodzaj}</span></div>
                                    <div>Okres: <span className="font-bold">{correctElement.okres}</span></div>
                                </div>
                            </div>
                            
                            {/* Share button */}
                            <button 
                                className="relative z-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onClick={() => {
                                    navigator.clipboard.writeText(`Odgadłem dzisiejszy pierwiastek w Elementle w ${guesses.length} próbach! 🎉`);
                                    alert('Skopiowano do schowka!');
                                }}
                            >
                                Udostępnij wynik
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Nagłówek gry */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white border-b border-white/20 w-full">
                    <div className="flex items-center justify-center space-x-3">
                        <img src="/logo.png" alt="Logo" className="h-10 drop-shadow-lg" />
                        <h1 className="text-2xl font-bold drop-shadow-md text-lime-400">Elementle</h1>
                    </div>
                </div>

                {/* Formularz zgadywania */}
                <form onSubmit={handleSubmit} className="p-4 flex items-center border-b border-white/20 w-full">
                    <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                        <img src="/question.svg" alt="?" className="w-6 h-6 filter brightness-0 invert" />
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setInputError(null);
                            }}
                            placeholder="Wpisz nazwę pierwiastka"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-white bg-white/20 backdrop-blur-sm placeholder-white/70 ${
                                inputError 
                                    ? 'border-red-400 focus:ring-red-400' 
                                    : 'border-white/30 focus:ring-blue-400'
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
                </form>

                {/* Wyniki */}
                <div className="overflow-auto flex-1 w-full">
                    <div className="min-w-full">
                        {/* Nagłówki kolumn */}
                        <div className="grid grid-cols-6 gap-2 p-3 bg-white/10 text-xs font-semibold text-white/80 sticky top-0 backdrop-blur-sm">
                            <div>Nazwa</div>
                            <div>Rodzaj</div>
                            <div>Masa</div>
                            <div>Rok</div>
                            <div>Elektrouj.</div>
                            <div>Okres</div>
                        </div>

                        {/* Lista prób */}
                        <div className="divide-y divide-white/10">
                            {guesses.map((guess, index) => (
                                <div key={index} className="grid grid-cols-6 gap-2 p-3 text-sm text-white">
                                    <div className={guess.nazwa === correctElement.nazwa 
                                        ? "text-green-400 font-bold" 
                                        : "text-red-300"}>
                                        {guess.nazwa}
                                    </div>
                                    <div className={guess.rodzaj === correctElement.rodzaj 
                                        ? "text-green-400 font-bold" 
                                        : "text-red-300"}>
                                        {guess.rodzaj}
                                    </div>
                                    <div>
                                        {renderWithArrow(guess.masaAtomowa, correctElement.masaAtomowa, true)}
                                    </div>
                                    <div>
                                        {renderWithArrow(guess.rokOdkrycia, correctElement.rokOdkrycia)}
                                    </div>
                                    <div>
                                        {renderWithArrow(guess.elektroujemnosc, correctElement.elektroujemnosc)}
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
