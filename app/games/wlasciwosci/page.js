"use client";
import { fetchElementle } from "@/lib/firebase";
import React, { useEffect, useRef, useState } from "react";

function ElementCard({
  element,
  isCurrent = false,
  isVisible = false,
  onClickAttribute = null,
  highlightAttribute = null,
}) {
  return (
    <div className={`flex flex-col bg-green-500 h-1/2 w-1/6 min-w-80 rounded-md border-4 ${isCurrent ? "border-yellow-400" : "border-black"}`}>
      <h2 className="text-4xl text-center m-6 text-white">{element.nazwa}</h2>
      <div className="my-2">
        {[
          { label: "Masa Atomowa", value: element.masaAtomowa, key: "masaAtomowa" },
          { label: "Elektroujemnosc", value: element.elektroujemnosc, key: "elektroujemnosc" },
          { label: "Rok Odkrycia", value: element.rokOdkrycia, key: "rokOdkrycia" },
          { label: "Okres", value: element.okres, key: "okres" },
          { label: "Wartosciowość", value: element.wartosciowosc, key: "wartosciowosc" },
        ].map((attr) => (
          <div 
            key={attr.key}
            className={`grid grid-cols-[5fr_1fr] m-8 text-white ${isCurrent ? "cursor-pointer hover:bg-green-600 rounded p-1" : ""} ${highlightAttribute === attr.key ? "bg-blue-500 rounded p-1" : ""}`}
            onClick={() => isCurrent && onClickAttribute?.(attr.key)}
          >
            <div>{attr.label}:</div>
            <div className="font-bold">{isCurrent || isVisible ? attr.value : '?'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Page() {
  const [elements, setElements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState(new Set([0]));
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastComparedAttribute, setLastComparedAttribute] = useState(null);
  const [score, setScore] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      async function fetchData() {
        const response = await fetchElementle();
        // Sort elements by atomic mass for better progression
        const sortedElements = response.pierwiastki.sort((a, b) => a.masaAtomowa - b.masaAtomowa);
        setElements(sortedElements);
      }
      fetchData();
    }
  }, []);

  const handleAttributeClick = (attribute) => {
    if (currentIndex >= elements.length - 1 || gameStatus !== 'playing') return;

    const currentValue = elements[currentIndex][attribute];
    const nextValue = elements[currentIndex + 1][attribute];
    setLastComparedAttribute(attribute);

    if (currentValue > nextValue) {
      // Correct guess
      setScore(prev => prev + 1);
      const newVisibleIndices = new Set(visibleIndices);
      newVisibleIndices.add(currentIndex + 1);
      setVisibleIndices(newVisibleIndices);
      setCurrentIndex(currentIndex + 1);
      
      if (currentIndex + 1 === elements.length - 1) {
        setGameStatus('won');
      }
    } else {
      // Wrong guess
      setGameStatus('lost');
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setVisibleIndices(new Set([0]));
    setGameStatus('playing');
    setScore(0);
    setLastComparedAttribute(null);
  };

  if (elements.length === 0) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (gameStatus === 'won') {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-white">You Won!</h1>
        <p className="text-xl mb-4 text-white">Perfect score! You compared all {elements.length} elements correctly!</p>
        <div className="mb-8 text-2xl text-yellow-400">
          Final Score: {score}/{elements.length - 1}
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
          onClick={resetGame}
        >
          Play Again
        </button>
      </div>
    );
  }

  if (gameStatus === 'lost') {
    const currentElement = elements[currentIndex];
    const nextElement = elements[currentIndex + 1];
    const losingAttribute = Object.keys(currentElement).find(key => 
      currentElement[key] <= nextElement[key] && lastComparedAttribute === key
    );

    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-white">Game Over</h1>
        <div className="text-xl mb-6 text-white text-center">
          <p>{currentElement.nazwa}'s {losingAttribute} was {currentElement[losingAttribute]}</p>
          <p>{nextElement.nazwa}'s {losingAttribute} was {nextElement[losingAttribute]}</p>
        </div>
        <div className="mb-8 text-2xl text-yellow-400">
          Your Score: {score}/{elements.length - 1}
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
          onClick={resetGame}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-10 bg-gray-900">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Element Challenge</h1>
        <p className="text-xl text-white">Select an attribute that is <span className="font-bold">HIGHER</span> in this element than the next one</p>
      </div>
      
      <div className="flex flex-row items-start gap-8 mb-8">
        <ElementCard
          element={elements[currentIndex]}
          isCurrent={true}
          isVisible={true}
          onClickAttribute={handleAttributeClick}
          highlightAttribute={lastComparedAttribute}
        />

        {currentIndex < elements.length - 1 && (
          <ElementCard
            element={elements[currentIndex + 1]}
            isVisible={visibleIndices.has(currentIndex + 1)}
            highlightAttribute={lastComparedAttribute}
          />
        )}
      </div>

      <div className="flex flex-col items-center text-white">
        <div className="text-2xl mb-2">Score: <span className="font-bold">{score}</span></div>
        <div className="text-lg">Progress: {currentIndex + 1} of {elements.length}</div>
        <div className="mt-4 text-sm text-gray-300">
          Tip: Atomic mass generally increases across the periodic table
        </div>
      </div>
    </div>
  );
}

export default Page;
