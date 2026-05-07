"use client";

import { cn } from "../../lib/utils";
import { BackgroundGradientAnimation } from "./background-gradient-animation";
import dynamic from "next/dynamic";
import { useState } from "react";
import animationData from "../../data/confetti.json";
import MagicButton from "./MagicButton";
import { IoCopyOutline } from "react-icons/io5";
import { GlobeDemo } from "./GridGlobe";

const Player = dynamic(() => import("lottie-react"), { ssr: false });

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  image,
  imgClassName,
  spareImage,
  spareImageClassName,
  titleClassName,
  cardType = "default",
  techStackLeft = [],
  techStackRight = [],
  emailAddress = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!emailAddress) return;
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input justify-between flex flex-col space-y-4",
        "border border-white/[0.2] bg-[rgb(4,7,29)] text-white shadow-none",
        className
      )}
    >
      <div className={cn(cardType === "emailCta" && "flex justify-center", "h-full")}>
        <div className="w-full h-full absolute">
          {image && (
            <img
              loading="lazy"
              src={image}
              alt=""
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>

        <div className={cn("absolute right-0 -bottom-5", spareImageClassName)}>
          {spareImage && (
            <img
              loading="lazy"
              src={spareImage}
              alt=""
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>

        {cardType === "emailCta" && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" />
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>

          <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
            {title}
          </div>

          {cardType === "globe" && <GlobeDemo />}

          {cardType === "techStack" && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {techStackLeft.map((item, i) => (
                  <span
                    key={`left-${i}`}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E] text-white"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E] text-white"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E] text-white"></span>
                {techStackRight.map((item, i) => (
                  <span
                    key={`right-${i}`}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E] text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cardType === "emailCta" && (
            <div className="mt-5 relative">
              {copied && (
                <div className="absolute -bottom-5 right-0">
                  <Player animationData={animationData} autoplay loop style={{ height: 200, width: 400 }} />
                </div>
              )}
              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses="!bg-[#161A31] rounded-md h-8 md:h-8"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
