"use client";
import { fetchElementle } from "@/lib/firebase";
import React, { useCallback, useEffect, useRef, useState } from "react";

function ElementCard({
    id,
    nazwa,
    masaAtomowa,
    elektroujemnosc,
    rokOdkrycia,
    okres,
    wartosciowosc,
}) {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <>
            {isVisible ? (
                <div className="flex flex-col bg-green-500 h-1/2 w-1/6 min-w-80 rounded-md border-4 border-black">
                    <h2 className="text-4xl text-center m-6">{nazwa}</h2>
                    <div className="my-2">
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Masa Atomowa:</div>
                            <div>{masaAtomowa}</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Elektroujemnosc:</div>
                            <div>{elektroujemnosc}</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Rok Odkrycia:</div>
                            <div>{rokOdkrycia}</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Okres:</div>
                            <div>{okres}</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Wartosciowość:</div>
                            <div>{wartosciowosc}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col bg-green-500 h-1/2 w-1/6 min-w-80 rounded-md border-4 border-black">
                    <h2 className="text-4xl text-center m-6">{nazwa}</h2>
                    <div className="my-2">
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Masa Atomowa:</div>
                            <div>?</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Elektroujemnosc:</div>
                            <div>?</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Rok Odkrycia:</div>
                            <div>?</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Okres:</div>
                            <div>?</div>
                        </div>
                        <div className="grid grid-cols-[5fr_1fr] m-8">
                            <div>Wartosciowość:</div>
                            <div>?</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function page() {
    const [elementle, setElementle] = useState(null);
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
    }, [hasFetched, setElementle]);
    console.log("Elementle:", elementle || "Loading...");
    // TODO: karta - buttony do porownanie pierwiastkow i stan jej
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <ElementCard
                id={1}
                nazwa={"test"}
                masaAtomowa={22}
                okres={2}
                wartosciowosc={2}
                rokOdkrycia={1775}
                elektroujemnosc={1}
            />
        </div>
    );
}

export default page;
