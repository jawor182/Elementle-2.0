"use client";
import { fetchElementle } from "@/lib/firebase";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
    }, []);
    console.log('Elementle:', elementle || 'Loading...');
    // TODO: karta - buttony do porownanie pierwiastkow i stan jej
    return (
        <div className="relative flex-1 bg-bgImg bg-repeat bg-cover bg-zinc-500"></div>
    );
}

export default page;
