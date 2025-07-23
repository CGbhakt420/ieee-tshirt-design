// src/sections/Hero.jsx

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

// A component to animate each word
const AnimatedWords = ({ text, el: Wrapper = 'h1', className }) => {
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <Wrapper className={className}>
            <motion.span
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {text.split(' ').map((word, index) => {
                    // Check if the word should have a gradient
                    const isGradient = word.includes('Your') || word.includes('Reality');
                    return (
                        <motion.span
                            key={index}
                            variants={child}
                            className={`inline-block mr-[0.25em] ${
                                isGradient
                                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent'
                                : ''
                            }`}
                        >
                            {word}
                        </motion.span>
                    );
                })}
            </motion.span>
        </Wrapper>
    );
};


const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen w-full flex flex-col justify-center items-start px-6 md:px-12 snap-start">
      <div className="max-w-3xl">
        <AnimatedWords 
            text="Design Your Reality."
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none tracking-tight"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-6 text-lg text-gray-300 max-w-xl"
        >
          Step into the future of fashion. Our revolutionary 3D tool empowers you
          to forge unique apparel with AI-powered graphics and limitless
          creativity. Stop wearing trends—start creating them.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8"
        >
          <CustomButton
            type="filled"
            title="Start Creating Now"
            handleClick={() => navigate('/customizer')}
            customStyles="px-8 py-4 font-bold text-base bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
