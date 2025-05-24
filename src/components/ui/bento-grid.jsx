import { cn } from "../../lib/utils";
import { BackgroundGradientAnimation } from "./background-gradient-animation";
import { GlobeDemo } from "./GridGlobe";
import Player from "lottie-react";
import { useState } from "react";
import animationData from "../../data/confetti.json";
import MagicButton from "./MagicButton";
import { IoCopyOutline } from "react-icons/io5";

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto ",
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
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}) => {
  const leftLists = [ "Next.js", "Typescript"];
  const rightLists = ["MongoDb", "Node.js"];

  const [copied, setCopied] = useState(false);

  // Removed defaultOptions for react-lottie

  const handleCopy = () => {
    navigator.clipboard.writeText("chmjunaidsaleem@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 border border-white/[0.1] ",
        className
      )}
      style={{
  backgroundColor: "rgb(3,0,45)",
  backgroundImage: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(3,3,86,1) 16%, rgba(2,103,166,1) 78%, rgba(0,212,255,1) 100%)",
}}

    >
      <div className={`${id === 6 ? "flex justify-center" : ""} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            <img
              loading="lazy"
              src={img}
              alt={img}
              width={50}
              height={50}
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>
        <div
          className={cn("absolute right-0 -bottom-5", id === 5 && "w-full opacity-80")}>
          {spareImg && (
            <img
              loading="lazy"
              src={spareImg}
              alt={spareImg}
              width={50}
              height={50}
              className={"object-cover object-center w-full h-full"}
            />
          )}
        </div>
        {id === 6 && (
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
          <div className="font-sans font-extralight md:max-w-32 text-[#c1c2d3]  md:text-xs lg:text-base text-sm z-10">
            {description}
          </div>
          <div className="font-sans font-bold text-lg lg:text-3xl max-w-96 z-10">
            {title}
          </div>

          {id === 2 && <GlobeDemo />}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-1">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className=" lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#271564]"
                  >
                    {item}
                  </span>
                ))}
                <span className="py-4 px-3 rounded-lg text-center bg-[#101546]"></span>
              </div>
              <span className=" py-4 px-3 rounded-lg text-center bg-[#10132E]" />
              <div className="flex flex-col gap-1">
                <span className="py-4 px-3  rounded-lg text-center bg-[#10132E]" />
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className=" lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#271564]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              <div className={`absolute -bottom-5 right-0`}>
                <Player
                  autoplay={copied}
                  loop={copied}
                  animationData={animationData}
                  style={{ height: 200, width: 400 }}
                />
              </div>
              <MagicButton
                title={copied ? "Email copied!" : "Copy my Email"}
                icon={<IoCopyOutline />}
                position="left"
                otherClasses="!bg-[#161a31]"
                handleClick={handleCopy}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
