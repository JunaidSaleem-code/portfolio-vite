import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { gridItems } from '../data';

export default function Grid() {
  return (
    <section id="about" className="w-full px-4 md:px-10 py-10">
      <BentoGrid className="max-w-screen-xl mx-auto">
        {gridItems.map(
          ({ id, title, description, className, img, imgClassName, titleClassName, spareImg }) => (
            <BentoGridItem
              key={id}
              id={id}
              title={title}
              description={description}
              className={className}
              img={img}
              imgClassName={`${imgClassName || ''} rounded-xl brightness-90 transition-transform duration-300 group-hover/bento:scale-105`}
              titleClassName={`${titleClassName || ''} text-white`}
              spareImg={spareImg}
            />
          )
        )}
      </BentoGrid>
    </section>
  );
}
