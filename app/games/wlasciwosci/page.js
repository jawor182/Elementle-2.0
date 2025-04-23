"use client";
import { fetchElementle } from "@/lib/firebase";
import React, { useEffect, useRef, useState } from "react";
import WinScreen from "@/app/_components/WinScreen";

function ElementCard({
  element,
  isVisible,
  onChooseValue,
}) {
  const { nazwa, masaAtomowa, elektroujemnosc, rokOdkrycia, okres, wartosciowosc } = element;

  const dane = [
    ["masaAtomowa", "Masa Atomowa", masaAtomowa],
    ["elektroujemnosc", "Elektroujemnosc", elektroujemnosc],
    ["rokOdkrycia", "Rok Odkrycia", rokOdkrycia],
    ["okres", "Okres", okres],
    ["wartosciowosc", "Wartościowość", wartosciowosc],
  ];

  return (
    <div className="flex flex-col bg-green-500 w-1/6 min-w-80 rounded-md border-4 border-black">
      <h2 className="text-4xl text-center m-4">{nazwa}</h2>
      <div className="my-2">
        {dane.map(([key, label, value]) => (
          <div
            key={key}
            className={`grid grid-cols-[5fr_1fr] m-8 hover:bg-green-900 ${
              isVisible ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => isVisible && onChooseValue?.(key, value)}
          >
            <div>{label}:</div>
            <div className="text-right w-20">{isVisible ? value : "?"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function page() {
  const [elementle, setElementle] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      async function fetchData() {
        const response = await fetchElementle();
        setElementle(response.pierwiastki);
      }
      fetchData();
    }
  }, []);

  const handleChoose = (property, value) => {
    if (currentIndex + 1 >= elementle.length) return;

    const currentElement = elementle[currentIndex];
    const nextElement = elementle[currentIndex + 1];
    const nextValue = nextElement[property];

    // Debugowanie
    console.log("--- PORÓWNANIE ---");
    console.log("Właściwość:", property);
    console.log("Aktualna wartość:", value);
    console.log("Następna wartość:", nextValue);
    console.log("Typ aktualnej:", typeof value);
    console.log("Typ następnej:", typeof nextValue);
    console.log("Wynik porównania (>=):", value >= nextValue );

    if (value >= nextValue) {
      const newScore = score + 1;
      setScore(newScore);
      setCurrentIndex((prev) => prev + 1);

      if (newScore === 4) {
        setWon(true);
        setGameOver(true);
      }
    } else {
      console.log("Błędne porównanie!");
      setGameOver(true);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center text-white">Porównaj właściwości pierwiastków</h1>
      
      <div className="flex flex-wrap justify-center items-center gap-4 flex-grow-0">
        {elementle.map((elem, index) => (
          <ElementCard
            key={elem.id}
            element={elem}
            isVisible={index <= currentIndex}
            onChooseValue={index === currentIndex && !gameOver ? handleChoose : null}
          />
        ))}
      </div>

      <div className="text-xl text-center space-y-2">
        {gameOver ? (
          won ? (
            <WinScreen />
          ) : (
            <p className="text-red-700 font-bold">❌ Przegrałeś! Spróbuj ponownie.</p>
          )
        ) : (
          <p className="text-white">Wynik: {score}</p>
        )}
      </div>
    </div>
  );
}

export default page;
