"use client";
import React, { useEffect, useState } from "react";
import { fetchUzupelnianie } from "@/lib/firebase";
import WinScreen from "@/app/_components/WinScreen";

const Uzupelnianie = () => {
    const [reaction, setReaction] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const loadDailyReaction = async () => {
        try {
            setLoading(true);
            const data = await fetchUzupelnianie();
            setReaction(data);
            setUserInput("");
            setIsCorrect(null);
            setSubmitted(false);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDailyReaction();
    }, []);

    const handleChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (userInput.trim() === reaction.correctAnswer) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center font-roboto bg-[url('/images/bg.png')] bg-cover bg-no-repeat min-h-[91vh] flex justify-center items-center">
                <p>Ładowanie reakcji...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center font-roboto bg-[url('/images/bg.png')] bg-cover bg-no-repeat min-h-[91vh] flex justify-center items-center">
                <p className="text-red-500">Wystąpił błąd: {error}</p>
            </div>
        );
    }

    if (isCorrect) {
        return <WinScreen />;
    }

    return (
        <div className="text-center font-roboto bg-[url('/images/bg.png')] bg-cover bg-no-repeat min-h-[91vh] flex justify-center items-center flex-col">
            <div className="text-[calc(100%+40px)] bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent">
                Uzupełnianie Reakcji Chemicznej
            </div>
            <p className="text-[calc(100%+20px)] text-white m-4">
                Uzupełnij poniższą reakcję chemiczną:
            </p>
            <div className="flex justify-center mb-5">
                <div className="flex-1 bg-gray-100 p-5 rounded mr-[30px] text-black">
                    <span className="font-bold">Nazwa: </span>
                    <span>{reaction.nazwa}</span>
                </div>
                <div className="flex-1 bg-gray-100 p-5 rounded mr-[30px] text-black">
                    <span className="font-bold">Reagenty: </span>
                    <span>{reaction.reagenty.join(" + ")}</span>
                </div>
                <div className="flex-1 bg-gray-100 p-5 rounded text-black">
                    <span className="font-bold">Produkty: </span>
                    <span>{reaction.produkty.join(" + ")}</span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleChange}
                    placeholder="Wpisz brakujący element"
                    className="w-[300px] h-[40px] text-[120%] mr-[10px] p-[5px]"
                    disabled={isCorrect === true}
                />
                <button
                    type="submit"
                    className="h-[40px] text-white bg-[#017129] hover:bg-[#015526] border-none cursor-pointer"
                    disabled={isCorrect === true}
                >
                    Sprawdź
                </button>
            </form>
            {submitted && isCorrect === false && (
                <p className="text-red-500">
                    Nieprawidłowa odpowiedź, spróbuj ponownie.
                </p>
            )}
        </div>
    );
};

export default Uzupelnianie;
