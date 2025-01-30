import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="bg-zinc-800 text-white text-center flex  items-center justify-center h-8">
            &copy;&nbsp;2025&nbsp;
            <Link id="footer-link" href="https://github.com/jawor182/Elementle-2.0/">
                <div className="underline italic font-semibold">Elementle</div>
            </Link>
            . Wszelkie prawa zastrzeżone.
        </div>
  )
}

export default Footer