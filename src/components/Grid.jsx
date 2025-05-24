import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import { gridItems } from '../data'

export default function Grid  ()  {
  return  (
    <section id='about'>
        <BentoGrid className='w-screen py-20'>
           {gridItems.map(({id,title, description, className, img, imgClassName, titleClassName, spareImg})=>(
            <BentoGridItem
            id={id}
            key={id}
            title={title}
            description={description}
            className={className}
            img={img}
            imgClassName={imgClassName}
            titleClassName={titleClassName}
            spareImg={spareImg}
            />
           )
           )}
        </BentoGrid>
    </section>
)
}

