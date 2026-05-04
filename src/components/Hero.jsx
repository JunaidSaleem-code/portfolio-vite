"use client";

import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";

const DEFAULTS = {
  tagline: "JavaScript | React | Next",
  headline: "Turning Ideas Into Interactive Web Realities",
  subheadline: "Hi, I'm Junaid, a JavaScript Developer based in Lahore, Pakistan.",
  ctaText: "Explore Projects",
  ctaLink: "#projects",
  resumeUrl: "/resume.pdf",
  resumeButtonText: "Download CV",
};

const Hero = ({ content }) => {
  const {
    tagline,
    headline,
    subheadline,
    ctaText,
    ctaLink,
    resumeUrl,
    resumeButtonText,
  } = { ...DEFAULTS, ...(content || {}) };

  return (
    <section className="relative pt-36 pb-20">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="h-screen w-full bg-black bg-grid-white/[0.2] flex items-center justify-center absolute top-0 left-0">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            {tagline}
          </h2>
          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
            words={headline}
            duration={1.5}
            filter={false}
          />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl text-gray-300">
            {subheadline}
          </p>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <a href={ctaLink}>
              <MagicButton title={ctaText} icon={<FaLocationArrow />} position="right" />
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-zinc-950/60 px-7 text-sm font-medium text-white backdrop-blur-md transition hover:border-purple-400 hover:bg-zinc-900 md:w-60 md:mt-10"
              >
                <LuDownload className="h-4 w-4" />
                {resumeButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
