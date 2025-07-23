// src/sections/HowItWorks.jsx

import { motion } from 'framer-motion';

const steps = [
    { title: "Imagine", description: "Use our AI prompter to describe the design you want." },
    { title: "Create", description: "Customize colors, upload logos, and perfect your look." },
    { title: "Share", description: "Publish your creation to the community and save it to your gallery." }
]

const HowItWorks = () => {
    return (
        <section className="w-full min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-black bg-opacity-50">
             <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">Three Simple Steps</h2>
                <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
                    From a spark of an idea to a wearable piece of art.
                </p>
            </motion.div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
                {steps.map((step, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="text-center flex-1"
                    >
                        <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-4 border-4 border-teal-300">
                            <span className="text-4xl font-black text-white">{index + 1}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-teal-500">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default HowItWorks;
