"use client";

import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

export default function Grid({ items = [] }) {
  return (
    <section id="about" className="w-full px-4 md:px-10 py-10">
      <BentoGrid className="max-w-screen-xl mx-auto">
        {items.map((item) => (
          <BentoGridItem
            key={item._id || item.id}
            title={item.title}
            description={item.description}
            className={item.className}
            image={item.image}
            imgClassName={`${item.imgClassName || ""} rounded-xl brightness-90 transition-transform duration-300 group-hover/bento:scale-105`}
            titleClassName={`${item.titleClassName || ""} text-white`}
            spareImage={item.spareImage}
            spareImageClassName={item.spareImageClassName}
            cardType={item.cardType}
            techStackLeft={item.techStackLeft}
            techStackRight={item.techStackRight}
            emailAddress={item.emailAddress}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
