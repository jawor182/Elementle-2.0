import React from "react";
import Image from "next/image";
import bg from "../../public/bg.png"

const Background = () => {
  return (
    <div className="relative w-full flex-1 bg-zinc-500 -z-10">
        <Image
        alt="Tło"
        src={bg}
        quality={100}
        fill
        style={
            {
                objectFit: "cover",
                zIndex:-1,
            }
        }
        >
        </Image>
    </div>
  );
};

export default Background;
