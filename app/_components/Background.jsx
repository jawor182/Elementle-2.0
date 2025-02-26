import React from "react";
import Image from "next/image";
import bg from "../../public/bg.png";

const Background = () => {
  return (
      <div className="relative w-full min-h-screen flex-1 bg-zinc-500 -z-10">
      <Image
        alt="Tło"
        src={bg}
        quality={100}
        priority
        fill
        className="h-screen"
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default Background;
