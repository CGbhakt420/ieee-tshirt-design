// src/sections/Showcase.jsx

import { motion } from 'framer-motion';

const sampleDesigns = [
    'https://placehold.co/600x800/101010/ffffff?text=Abstract+Art',
    'https://placehold.co/600x800/14b8a6/101010?text=Minimalist',
    'https://placehold.co/600x800/f97316/ffffff?text=Bold+Typography',
    'https://placehold.co/600x800/8b5cf6/ffffff?text=Cyberpunk',
    'https://placehold.co/600x800/ec4899/101010?text=Floral+Pattern'
];

const Showcase = () => {
    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="w-full py-24 px-6 md:px-12 bg-black bg-opacity-30 backdrop-blur-sm snap-start">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">A World of Possibilities</h2>
                <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
                    From sleek minimalism to vibrant chaos, see what others have created.
                </p>
            </motion.div>
            
            <motion.div 
                className="flex gap-8 overflow-x-auto pb-8"
                variants={containerVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                {sampleDesigns.map((src, index) => (
                    <motion.div 
                        key={index}
                        className="flex-shrink-0 w-72 md:w-96"
                        variants={itemVariants}
                    >
                        <img 
                            src={src} 
                            alt={`Sample Design ${index + 1}`} 
                            className="w-full h-auto object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default Showcase;
