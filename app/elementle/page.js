"use client";
import { useEffect, useState, useCallback } from 'react';
import Footer from '../_components/Footer';
import Header from '../_components/Header';
import { fetchElementle } from '@/lib/firebaseService';
import useLocalStorage from 'use-local-storage';
import { clearOldCache } from '@/lib/offlineService';

const ElementleFirebase = () => {
    const [isOnline, setIsOnline] = useState(true);
    const currentDate = new Date().toISOString().slice(0, 10);
    console.log('[1] Current date:', currentDate);
    
    // Game state
    const [inputValue, setInputValue] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [disableInput, setDisableInput] = useState(false);
    const [correctElement, setCorrectElement] = useState(null);
    const [win, setWin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Local storage
    const [localGuesses, setLocalGuesses] = useLocalStorage('fb_guesses', []);
    const [localDisableInput, setLocalDisableInput] = useLocalStorage('fb_disableInput', false);
    const [localCorrectElement, setLocalCorrectElement] = useLocalStorage('fb_correctElement', null);
    const [localWin, setLocalWin] = useLocalStorage('fb_win', false);
    const [localCurrentDate, setLocalCurrentDate] = useLocalStorage('fb_currentDate', '');

    console.log('[2] Local storage values:', {
        localCurrentDate,
        localCorrectElement,
        localGuesses,
        localDisableInput,
        localWin
    });

    const resetGame = useCallback(async () => {
        console.log('[17] Starting resetGame');
        // Clear local storage
        setLocalGuesses([]);
        setLocalDisableInput(false);
        setLocalWin(false);
        setLocalCurrentDate(currentDate);
        
        // Reset state
        setGuesses([]);
        setDisableInput(false);
        setWin(false);
        setCorrectElement(null);
        
        try {
            console.log('[18] Fetching new element');
            const dailyData = await fetchElementle();
            if (dailyData?.pierwiastek) {
                setCorrectElement(dailyData.pierwiastek);
                setLocalCorrectElement(dailyData.pierwiastek);
            } else {
                throw new Error('Invalid element data structure');
            }
        } catch (err) {
            console.error('[19] Error in resetGame:', err);
            throw err;
        }
    }, [currentDate, setLocalCurrentDate, setLocalGuesses, setLocalDisableInput, setLocalWin, setLocalCorrectElement]);

    // Initialize game
    useEffect(() => {
        const initializeGame = async () => {
            try {
                console.log('[3] Starting game initialization');
                setLoading(true);
                
                // Check if we need to reset (new day)
                console.log('[4] Checking date:', { localCurrentDate, currentDate });
                if (localCurrentDate !== currentDate) {
                    console.log('[5] New day detected - resetting game');
                    await resetGame();
                    return;
                }

                // Load from local storage if available
                if (localCorrectElement) {
                    console.log('[6] Loading from local storage');
                    setCorrectElement(localCorrectElement);
                    setGuesses(localGuesses);
                    setDisableInput(localDisableInput);
                    setWin(localWin);
                } else {
                    console.log('[7] No local data - fetching new element');
                    const dailyData = await fetchElementle();
                    if (dailyData?.pierwiastek) {
                        setCorrectElement(dailyData.pierwiastek);
                        setLocalCorrectElement(dailyData.pierwiastek);
                        setLocalCurrentDate(currentDate);
                    } else {
                        throw new Error('Failed to fetch daily element');
                    }
                }
            } catch (err) {
                console.error('[8] Initialization error:', err);
                setError(err.message || 'Failed to initialize game');
            } finally {
                console.log('[9] Finished initialization');
                setLoading(false);
            }
        };

        initializeGame();
    }, [currentDate, localCurrentDate, localCorrectElement, localGuesses, localDisableInput, localWin, resetGame]);

    const handleGuessSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.trim() || !correctElement) return;

        try {
            const userGuess = inputValue.trim().toLowerCase();
            const isCorrect = userGuess === correctElement.nazwa.toLowerCase();
            
            if (isCorrect) {
                setWin(true);
                setLocalWin(true);
            }

            const guess = {
                nazwa: inputValue.trim(),
                rodzaj: isCorrect ? correctElement.rodzaj : '?',
                masaAtomowa: isCorrect ? correctElement.masaAtomowa : '?',
                rokOdkrycia: isCorrect ? correctElement.rokOdkrycia : '?',
                elektroujemnosc: isCorrect ? correctElement.elektroujemnosc : '?',
                okres: isCorrect ? correctElement.okres : '?'
            };

            const newGuesses = [...guesses, guess];
            setGuesses(newGuesses);
            setLocalGuesses(newGuesses);
            setInputValue('');
            
            if (newGuesses.length >= 6) {
                setDisableInput(true);
                setLocalDisableInput(true);
            }
        } catch (error) {
            console.error('Guess submission error:', error);
            setError('An error occurred while processing your guess');
        }
    };

    if (loading) {
        return (
            <div className="relative flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-2xl">Ładowanie gry...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl text-red-500 mb-4">{error}</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative flex flex-col min-h-screen">
            <Header />
            
            <div className="relative flex-1 bg-bgImg bg-repeat bg-cover bg-zinc-500">
                <div className="w-full flex flex-col items-center pt-8">
                    <div className="flex items-center justify-center content-center mb-8">
                        <img src="/logo.png" alt="logo gry" className="h-24 w-24" />
                        <div className="text-8xl text-transparent bg-clip-text"
                            style={{
                                backgroundImage: "linear-gradient(to right, #06b6d4, #ef4444, #facc15, #22c55e)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                            Elementle
                        </div>
                    </div>

                    {/* Game Area */}
                    <div className="w-[840px] bg-[#017129] rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex justify-center mb-6">
                            <img 
                                id="inputImage"
                                src="/question-mark.svg" 
                                alt="question-mark" 
                                className="h-24 w-24" 
                            />
                        </div>
                        
                        <form onSubmit={handleGuessSubmit} className="flex justify-center">
                            <input
                                disabled={disableInput || win}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-3/4 h-12 text-2xl px-4 rounded"
                                placeholder="Podaj pierwiastek"
                                required
                            />
                        </form>
                    </div>

                    {/* Results */}
                    <div className="w-[840px] mb-8">
                        <div className="grid grid-cols-6 gap-4 mb-4 font-bold text-lg">
                            <div>Nazwa</div>
                            <div>Rodzaj</div>
                            <div>Masa</div>
                            <div>Rok</div>
                            <div>Elektroujemność</div>
                            <div>Okres</div>
                        </div>
                        
                        <div className="space-y-2">
                            {guesses.map((guess, index) => (
                                <div key={index} className="grid grid-cols-6 gap-4">
                                    {Object.keys(guess).map((key) => (
                                        <div 
                                            key={key}
                                            className={`h-20 rounded-full flex items-center justify-center text-white ${
                                                guess[key] === correctElement[key] 
                                                    ? 'bg-green-600' 
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            {guess[key]}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default ElementleFirebase;