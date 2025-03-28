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
        if (!userGuess) return;

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
        } else {
            setError(`Nie znaleziono pierwiastka "${inputValue}". Sprawdź pisownię.`);
        }
    };

    const renderWithArrow = (guessValue, correctValue, isMass = false) => {
        // Zaokrąglanie tylko dla masy atomowej
        const displayGuessValue = isMass ? Math.round(Number(guessValue)).toString() : guessValue;
        const displayCorrectValue = isMass ? Math.round(Number(correctValue)).toString() : correctValue;

        if (displayGuessValue === displayCorrectValue) {
            return <span className="text-green-600 font-bold">{displayGuessValue}</span>;
        }

        const numGuess = Number(displayGuessValue);
        const numCorrect = Number(displayCorrectValue);
        
        if (isNaN(numGuess) || isNaN(numCorrect)) {
            return <span className="text-red-600">{displayGuessValue || '-'}</span>;
        }

        if (numGuess > numCorrect) {
            return (
                <div className="flex items-center text-yellow-500">
                    {displayGuessValue}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="flex items-center text-yellow-500">
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
                <div className="relative z-10 text-xl font-semibold text-gray-800 bg-white p-4 rounded-lg">
                    Ładowanie gry...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative h-screen flex items-center justify-center">
                <Background className="absolute inset-0 z-0 object-cover w-full h-full" />
                <div className="relative z-10 text-xl font-semibold text-red-600 bg-white p-4 rounded-lg max-w-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <Background className="absolute inset-0 z-0 object-cover w-full h-full" />
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                {win && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-2xl font-bold">
                            Wygrałeś!
                        </div>
                    </div>
                )}
                
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl flex flex-col" 
                     style={{ maxHeight: '90vh' }}>
                    {/* Nagłówek */}
                    <div className="bg-blue-600 p-4 text-white">
                        <div className="flex items-center justify-center space-x-3">
                            <img src="/images/logo.png" alt="Logo" className="h-10" />
                            <h1 className="text-xl font-bold">Elementle</h1>
                        </div>
                    </div>

                    {/* Formularz zgadywania */}
                    <form onSubmit={handleSubmit} className="p-4 flex items-center border-b">
                        <div className="bg-gray-200 rounded-full p-2 mr-3">
                            <img src="/images/question-mark.svg" alt="?" className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Wpisz nazwę pierwiastka"
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={disableInput}
                            autoFocus
                        />
                    </form>

                    {error && (
                        <div className="px-4 py-2 text-sm text-red-600 bg-red-50">
                            {error}
                        </div>
                    )}

                    {/* Wyniki */}
                    <div className="overflow-auto flex-1">
                        <div className="min-w-full">
                            {/* Nagłówki kolumn */}
                            <div className="grid grid-cols-6 gap-2 p-2 bg-gray-100 text-xs font-semibold sticky top-0">
                                <div>Nazwa</div>
                                <div>Rodzaj</div>
                                <div>Masa</div>
                                <div>Rok</div>
                                <div>Elektrouj.</div>
                                <div>Okres</div>
                            </div>

                            {/* Lista prób */}
                            <div className="divide-y">
                                {guesses.map((guess, index) => (
                                    <div key={index} className="grid grid-cols-6 gap-2 p-2 text-xs">
                                        <div className={guess.nazwa === correctElement.nazwa ? "text-green-600 font-bold" : "text-red-600"}>
                                            {guess.nazwa}
                                        </div>
                                        <div className={guess.rodzaj === correctElement.rodzaj ? "text-green-600 font-bold" : "text-red-600"}>
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
        </div>
    );
};

export default Elementle;