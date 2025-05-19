"use client";
import React, { useEffect, useState } from "react";
import { fetchUzupelnianie } from "@/lib/firebase";
import WinScreen from "@/app/_components/WinScreen";

const LOCAL_STORAGE_KEY = "uzupelnianie-state";
const getTodayDate = () => new Date().toISOString().split('T')[0];

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

const Uzupelnianie = () => {
  const [reaction, setReaction] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load game data and restore state
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const data = await fetchUzupelnianie();
        setReaction(data);

        const saved = loadFromLocalStorage();
        if (saved) {
          setUserInput(saved.userInput || "");
          setSubmitted(!!saved.submitted);
          setIsCorrect(saved.isCorrect);
        }
      } catch (err) {
        setError(err.message || "Wystąpił nieznany błąd");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Save state
  useEffect(() => {
    if (reaction) {
      saveToLocalStorage({ userInput, submitted, isCorrect });
    }
  }, [userInput, submitted, isCorrect, reaction]);

  const handleChange = (e) => setUserInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (userInput.trim() === reaction.correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  if (loading) return (
    <div className="text-center font-roboto bg-[url('/images/bg.png')] bg-cover bg-no-repeat min-h-[91vh] flex justify-center items-center">
      <p>Ładowanie reakcji...</p>
    </div>
  );

  if (error) return (
    <div className="text-center font-roboto bg-[url('/images/bg.png')] bg-cover bg-no-repeat min-h-[91vh] flex justify-center items-center">
      <p className="text-red-500">Wystąpił błąd: {error}</p>
    </div>
  );

  if (isCorrect) return <WinScreen />;

  return (
    <div className="text-center font-roboto bg-[url('/images/bg.png')] bg-cover bg-no-repeat min-h-[91vh] flex justify-center items-center flex-col p-4">
      <h1 className="text-2xl md:text-5xl lg:text-6xl bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent font-extrabold mb-4">
        Uzupełnianie Reakcji Chemicznej
      </h1>
      <p className="text-lg md:text-2xl lg:text-3xl text-white mb-6">
        Uzupełnij poniższą reakcję chemiczną:
      </p>
      <div className="flex flex-col md:flex-row text-lg md:text-xl justify-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
        <div className="bg-gray-100 p-5 rounded text-black">
          <span className="font-bold">Nazwa: </span>
          <span>{reaction.nazwa}</span>
        </div>
        <div className="bg-gray-100 p-5 rounded text-black">
          <span className="font-bold">Reagenty: </span>
          <span>{reaction.reagenty.join(" + ")}</span>
        </div>
        <div className="bg-gray-100 p-5 rounded text-black">
          <span className="font-bold">Produkty: </span>
          <span>{reaction.produkty.join(" + ")}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col  md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Wpisz brakujący element"
          className="w-full md:w-80 h-10 text-lg md:text-2xl p-2 rounded border focus:outline-none"
          disabled={isCorrect === true}
        />
        <button
          type="submit"
          className="h-10 px-6 text-white bg-[#017129] hover:bg-[#015526] rounded"
          disabled={isCorrect === true}
        >
          Sprawdź
        </button>
      </form>
      {submitted && isCorrect === false && (
        <p className="mt-4 text-red-500">Nieprawidłowa odpowiedź, spróbuj ponownie.</p>
      )}
    </div>
  );
};

export default Uzupelnianie;

