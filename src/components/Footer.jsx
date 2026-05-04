"use client";

import { useState } from "react";
import Image from "next/image";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import ContactDialog from "./ContactDialog";
import SubscribeForm from "./SubscribeForm";

const DEFAULTS = {
  headline: "Ready to take your digital presence to the next level?",
  paragraph: "Reach out to me today and let's discuss how I can help you achieve your goals.",
  ctaText: "Let's get in touch",
  contactEmail: "chmjunaidsaleem@gmail.com",
  copyright: "Copyright © 2024 Junaid",
};

const Footer = ({ content, socialLinks = [] }) => {
  const { headline, paragraph, ctaText, contactEmail, copyright } = { ...DEFAULTS, ...(content || {}) };
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="w-full mb-[100px] pb-10" id="contact">
        <div className="flex flex-col items-center">
          <h1 className=" md:text-3xl text-2xl font-bold text-center lg:max-w-[45vw] text-white">
            {headline.split(" your ").length > 1 ? (
              <>
                {headline.split(" your ")[0]} <span className="text-purple-400">your</span>{" "}
                {headline.split(" your ")[1]}
              </>
            ) : (
              headline
            )}
          </h1>
          <p className="text-white md:mt-10 my-5 text-center">{paragraph}</p>
          <button type="button" onClick={() => setContactOpen(true)} className="cursor-pointer">
            <MagicButton title={ctaText} icon={<FaLocationArrow />} position="right" />
          </button>

          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Stay in touch
            </p>
            <SubscribeForm source="footer" compact />
          </div>
        </div>

        <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
          <p className="md:text-base text-sm md:font-normal font-light text-blue-100">{copyright}</p>

          <div className="flex items-center md:gap-3 gap-6">
            {socialLinks.map((profile) => (
              <a
                key={profile._id || profile.id || profile.link}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
              >
                {profile.icon && (
                  <Image src={profile.icon} alt={profile.label || ""} width={20} height={20} />
                )}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        fallbackEmail={contactEmail}
      />
    </>
  );
};

export default Footer;
