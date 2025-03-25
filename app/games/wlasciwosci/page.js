import { fetchElementle } from '@/lib/firebase'
import React from 'react'

async function page() {
    const data = await fetchElementle();
    const gameData = data.pierwiastki;
    // TODO: karta - buttony do porownanie pierwiastkow i stan jej 
    return (
        <div className="relative flex-1 bg-bgImg bg-repeat bg-cover bg-zinc-500">
        </div>
    )
}

export default page
