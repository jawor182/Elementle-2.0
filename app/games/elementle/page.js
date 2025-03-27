"use client";
import { fetchElementle } from "@/lib/firebase";
import Background from "@/app/_components/Background";
import React, { useEffect, useState } from "react";
import pierwiastkiData from "@/data/pierwiastki"; // Import danych z lokalnego pliku

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
                
                // Pobierz poprawną odpowiedź z Firebase
                const dailyAnswer = await fetchElementle();
                console.log("Pobrana poprawna odpowiedź:", dailyAnswer);
                
                if (!dailyAnswer || !dailyAnswer.pierwiastek) {
                    throw new Error('Invalid data: Missing correct element.');
                }

                // Użyj lokalnych danych z pliku pierwiastki.js
                const pierwiastkiList = pierwiastkiData || [];
                const correctElementFromFirebase = dailyAnswer.pierwiastek;

                if (pierwiastkiList.length === 0) {
                    throw new Error('No elements found in local data.');
                }

                console.log("Lista pierwiastków (lokalna):", pierwiastkiList);
                console.log("Poprawny pierwiastek (Firebase):", correctElementFromFirebase);

                // Normalizacja danych - usuwanie białych znaków i zmiana na małe litery
                const normalizedElements = pierwiastkiList.map(el => ({
                    ...el,
                    nazwa: el.nazwa.trim().toLowerCase()
                }));

                setElements(normalizedElements);
                setCorrectElement({
                    ...correctElementFromFirebase,
                    nazwa: correctElementFromFirebase.nazwa.trim().toLowerCase()
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load game data. Please try again.");
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

        console.log("Szukany pierwiastek (normalized):", userGuess);
        console.log("Dostępne pierwiastki:", elements);

        const userGuessElement = elements.find(element => {
            return element.nazwa === userGuess;
        });

        console.log("Znaleziony element:", userGuessElement);

        if (userGuessElement) {
            const isCorrect = userGuessElement.nazwa === correctElement.nazwa;
            
            if (isCorrect) {
                setWin(true);
                setDisableInput(true);
            }

            setGuesses([...guesses, {
                ...userGuessElement,
                nazwa: userGuessElement.nazwa
            }]);
            setInputValue('');
            setError(null);
        } else {
            setError(`Element "${inputValue}" not found. Check spelling and try again.`);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Background />
                <div className="loading-message">Loading game...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Background />
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <>
            <Background />
            {win && <div className="win-message">You won!</div>}
            <div className="elementle-container">
                <div className="header-section">
                    <img src="/images/logo.png" alt="Elementle logo" className="logo" />
                    <h2>Elementle</h2>
                </div>

                <div className="input-section">
                    <div className="image-container">
                        <img src="/images/question-mark.svg" alt="Question mark" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input
                            disabled={disableInput}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Podaj pierwiastek"
                            required
                        />
                    </form>
                </div>

                <div className="results-section">
                    <div className="categories">
                        <div>Nazwa</div>
                        <div>Rodzaj</div>
                        <div>Masa</div>
                        <div>Rok</div>
                        <div>Elektroujemność</div>
                        <div>Okres</div>
                    </div>

                    <div className="guesses">
                        {guesses.map((guess, index) => (
                            <div key={index} className="guess-row">
                                <div className={guess.nazwa === correctElement.nazwa ? "correct" : "incorrect"}>
                                    {guess.nazwa}
                                </div>
                                <div className={guess.rodzaj === correctElement.rodzaj ? "correct" : "incorrect"}>
                                    {guess.rodzaj}
                                </div>
                                <div className={guess.masaAtomowa === correctElement.masaAtomowa ? "correct" : "incorrect"}>
                                    {guess.masaAtomowa}
                                </div>
                                <div className={guess.rokOdkrycia === correctElement.rokOdkrycia ? "correct" : "incorrect"}>
                                    {guess.rokOdkrycia}
                                </div>
                                <div className={guess.elektroujemnosc === correctElement.elektroujemnosc ? "correct" : "incorrect"}>
                                    {guess.elektroujemnosc}
                                </div>
                                <div className={guess.okres === correctElement.okres ? "correct" : "incorrect"}>
                                    {guess.okres}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Elementle;