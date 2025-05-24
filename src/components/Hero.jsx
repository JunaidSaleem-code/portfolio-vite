import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";


const Hero = () => {
  return (
    <section className="relative pt-36 pb-20">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

    {/* Grid */}
      <div className="h-screen w-full bg-black bg-grid-white/[0.2] flex items-center justify-center absolute top-0 left-0">
    
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
            <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">JavaScript | React | Next</h2>
            <TextGenerateEffect 
            className="text-center text-[40px] md:text-5xl lg:text-6xl" 
            words="Turning Ideas Into Interactive Web Realities"
            duration ={1.5}
            filter={false}
            />
            <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
                Hi, I&apos;m Junaid, a JavaScript Developer based in Lahore,Pakistan.
            </p>
        <a href="#projects">
        <MagicButton 
        title= "Explore Projects"
        icon={<FaLocationArrow/>}
        position="right"
        />
        </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
