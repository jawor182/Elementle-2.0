"use client";
import { fetchElementle } from "@/lib/firebase";
import React, { useEffect, useRef, useState } from "react";
import WinScreen from "@/app/_components/WinScreen";

const LOCAL_STORAGE_KEY = "elementle-compare-state";
const getTodayDate = () => new Date().toISOString().split("T")[0];

const saveToLocalStorage = (state) => {
  try {
    const withDate = { ...state, date: getTodayDate() };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(withDate));
  } catch (e) {
    console.warn("Nie udało się zapisać stan gry:", e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!json) return null;
    const parsed = JSON.parse(json);
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

function ElementCard({ element, isVisible, onChooseValue }) {
  const { nazwa, masaAtomowa, elektroujemnosc, rokOdkrycia, okres, wartosciowosc } = element;
  const dane = [
    ["masaAtomowa", "Masa Atomowa", masaAtomowa],
    ["elektroujemnosc", "Elektroujemnosc", elektroujemnosc],
    ["rokOdkrycia", "Rok Odkrycia", rokOdkrycia],
    ["okres", "Okres", okres],
    ["wartosciowosc", "Wartościowość", wartosciowosc],
  ];
  return (
    <div className="flex flex-col bg-green-500 w-full sm:w-80 md:w-96 lg:w-80 rounded-lg md:rounded-xl border-4 border-black">
      <h2 className="text-3xl md:text-4xl text-center m-4">{nazwa}</h2>
      <div className="my-2">
        {dane.map(([key, label, value]) => (
          <div
            key={key}
            className={`grid grid-cols-[4fr_1fr] m-4 hover:bg-green-900 ${isVisible ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => isVisible && onChooseValue?.(key, value)}
          >
            <div className="text-lg md:text-xl">{label}:</div>
            <div className="text-right w-24 text-lg md:text-xl">{isVisible ? value : "?"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ElementCompare() {
  const [elementle, setElementle] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    async function fetchData() {
      const resp = await fetchElementle();
      setElementle(resp.pierwiastki || []);
    }
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
    const saved = loadFromLocalStorage();
    if (saved) {
      setCurrentIndex(saved.currentIndex);
      setScore(saved.score);
      setGameOver(saved.gameOver);
      setWon(saved.won);
    }
  }, []);

  useEffect(() => {
    if (elementle.length) {
      saveToLocalStorage({ currentIndex, score, gameOver, won });
    }
  }, [currentIndex, score, gameOver, won, elementle]);

  const handleChoose = (property, value) => {
    if (gameOver || currentIndex + 1 >= elementle.length) return;
    const current = elementle[currentIndex];
    const next = elementle[currentIndex + 1];
    const nextValue = next[property];
    if (value >= nextValue) {
      const newScore = score + 1;
      setScore(newScore);
      setCurrentIndex(idx => idx + 1);
      if (newScore === 4) {
        setWon(true);
        setGameOver(true);
      }
    } else {
      setGameOver(true);
    }
  };

  if (!elementle.length) {
    return <div className="text-xl md:text-2xl">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 space-y-6 bg-bgImg bg-cover">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-center text-white">
        Porównaj właściwości pierwiastków
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-6 w-full px-4 overflow-x-auto">
        {elementle.map((elem, idx) => (
          <ElementCard
            key={elem.id}
            element={elem}
            isVisible={idx <= currentIndex}
            onChooseValue={idx === currentIndex && !gameOver ? handleChoose : null}
          />
        ))}
      </div>
      <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-center space-y-2 text-white">
        {gameOver ? (
          won ? <WinScreen /> : <p className="text-red-700 font-bold">❌ Przegrałeś! Spróbuj ponownie.</p>
        ) : (
          <p>Wynik: {score}</p>
        )}
      </div>
    </div>
  );
}

