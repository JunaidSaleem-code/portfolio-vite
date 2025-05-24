import MagicButton from './ui/MagicButton'
// import { FaLocationArrow } from 'react-icons/fa6'
import { FaLocationArrow } from "react-icons/fa";
import { socialMedia } from '../data'

const Footer = () => {
  return (
    <footer className="w-full mb-[100px] pb-10" id='contact'>
      <div className='flex flex-col items-center'>
        <h1 className=' md:text-3xl text-2xl font-bold text-center lg:max-w-[45vw]'>
            Ready to take <span className='text-purple-400'>your</span> digital presence to the next level?
        </h1>
        <p className='text-white-200 md:mt-10 my-5 text-center'>Reach out to me today and let&apos;s discuss how I can help you achieve your goals.</p>
      <a href="mailto:chmjunaidsaleem@gmail.com">
        <MagicButton
        title="Let's get in touch"
        icon={<FaLocationArrow/>}
        position='right'
        />
      </a>
        </div>

        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
            <p className='md:text-base text-sm md:font-normal font-light'>Copyright © 2024 Junaid</p>

            <div className="flex items-center md:gap-3 gap-6">
  {socialMedia.map((profile) => (
    <a
      key={profile.id}
      href={profile.link} // <-- Add this field in your data
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
    >
      <img src={profile.img} alt={profile.id.toString()} width={20} height={20} />
    </a>
  ))}
</div>
        </div>  
    </footer>
  )
}

export default Footer
