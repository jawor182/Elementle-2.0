"use client";
import { getDailyAnswers } from "@/lib/firebase"; // Only import what exists
import Background from "@/app/_components/Background";
import React, { useEffect, useRef, useState } from "react";

const Elementle = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const [inputValue, setInputValue] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [disableInput, setDisableInput] = useState(false);
    const [correctElement, setCorrectElement] = useState(null);
    const [win, setWin] = useState(false);
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            async function fetchData() {
                try {
                    setLoading(true);
                    // Get daily answers which contains both the elements and correct answer
                    const dailyAnswers = await getDailyAnswers();

                    if (dailyAnswers) {
                        const pierwiastkiList = dailyAnswers.pierwiastki || [];
                        const pierwiastki = dailyAnswers.pierwiastek || null;

                        if (!pierwiastki || pierwiastkiList.length === 0) {
                            throw new Error('Invalid data: Missing correct element or elements.');
                        }

                        setElements(pierwiastkiList);
                        setCorrectElement(pierwiastki);

                        // Restore game state from localStorage
                        const savedState = localStorage.getItem('elementleState');
                        if (savedState) {
                            const parsedState = JSON.parse(savedState);
                            if (parsedState.date === currentDate) {
                                setGuesses(parsedState.guesses || []);
                                setDisableInput(parsedState.disableInput || false);
                                setWin(parsedState.win || false);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setError("Failed to load game data. Please try again.");
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }
    }, [currentDate]);

    useEffect(() => {
        if (win) {
            setDisableInput(true);
            saveGameState();
        }
    }, [win]);

    const saveGameState = () => {
        const gameState = {
            date: currentDate,
            guesses,
            disableInput,
            win
        };
        localStorage.setItem('elementleState', JSON.stringify(gameState));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userGuess = inputValue.trim();
            if (!userGuess) return;

            const userGuessElement = elements.find(
                (element) => element.nazwa.toLowerCase() === userGuess.toLowerCase()
            );

            if (userGuessElement) {
                const isCorrect = correctElement &&
                    userGuessElement.nazwa === correctElement.nazwa;

                if (isCorrect) {
                    setWin(true);
                }

                const newGuesses = [...guesses, userGuessElement];
                setGuesses(newGuesses);
                saveGameState();
                setInputValue('');
            }
        } catch (error) {
            console.error('Error:', error);
            setError("An error occurred. Please try again.");
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
                                <div className={correctElement && guess.nazwa === correctElement.nazwa ? "correct" : "incorrect"}>
                                    {guess.nazwa}
                                </div>
                                <div className={correctElement && guess.rodzaj === correctElement.rodzaj ? "correct" : "incorrect"}>
                                    {guess.rodzaj}
                                </div>
                                <div className={correctElement && guess.masaAtomowa === correctElement.masaAtomowa ? "correct" : "incorrect"}>
                                    {guess.masaAtomowa}
                                </div>
                                <div className={correctElement && guess.rokOdkrycia === correctElement.rokOdkrycia ? "correct" : "incorrect"}>
                                    {guess.rokOdkrycia}
                                </div>
                                <div className={correctElement && guess.elektroujemnosc === correctElement.elektroujemnosc ? "correct" : "incorrect"}>
                                    {guess.elektroujemnosc}
                                </div>
                                <div className={correctElement && guess.okres === correctElement.okres ? "correct" : "incorrect"}>
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
