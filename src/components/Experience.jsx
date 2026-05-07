"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/moving-border";
import ScrollPathLayer from "./ScrollPathLayer";

const Experience = ({ items = [] }) => {
  const ref = useRef(null);

  return (
    <div ref={ref} className="relative py-20" id="experience">
      <ScrollPathLayer
        containerRef={ref}
        variant="experience"
        className="absolute left-0 right-0 top-32 h-40 w-full"
        opacity={0.45}
      />

      <h1 className="heading text-zinc-900 dark:text-white">
        My
        <span className="text-purple-400"> Work Experience</span>
      </h1>
      <div className="relative w-full mt-12 mx-1 grid lg:grid-cols-4 grid-cols-1 gap-10 ">
        {items.map((card) => (
          <Button
            key={card._id || card.id}
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            className="flex-1"
          >
            <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
              {card.thumbnail && (
                <Image
                  src={card.thumbnail}
                  alt=""
                  width={128}
                  height={128}
                  className="lg:w-32 md:w-20 w-16 h-auto"
                />
              )}
              <div className="lg:ms-5">
                <h1 className="text-start text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
                  {card.title}
                </h1>
                <p className="text-start text-zinc-600 dark:text-zinc-300 mt-3 font-medium">
                  {card.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
