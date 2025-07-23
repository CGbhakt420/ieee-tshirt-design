// src/sections/Features.jsx
import { motion } from 'framer-motion';

// Assuming FeatureCard is in its own file or defined elsewhere
// import FeatureCard from '../components/FeatureCard';

const featuresData = [
  {
    title: 'AI-Powered Graphics',
    description: 'Generate stunning, one-of-a-kind designs from a simple text prompt. Describe your vision, and let our AI bring it to life.',
  },
  {
    title: 'Full Creative Control',
    description: 'Upload your own logos, add custom text, and fine-tune colors and textures to craft apparel that is uniquely yours.',
  },
  {
    title: 'Live 3D Preview',
    description: 'No more guesswork. See your creations on a realistic 3D model in real-time, ensuring the final product is exactly what you imagined.',
  },
];

const FeatureCard = ({ title, description, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-8 rounded-2xl bg-gray-900 bg-opacity-60 border border-gray-800 shadow-lg"
        >
            <h3 className="text-2xl font-bold mb-3 text-teal-400">{title}</h3>
            <p className="text-gray-300">{description}</p>
        </motion.div>
    );
};


const Features = () => {
  return (
    <section className="w-full min-h-screen py-20 px-8 flex flex-col items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">Unleash Your Inner Designer</h2>
        <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
          Our platform is packed with powerful features to make your design process seamless and inspiring.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {featuresData.map((feature, index) => (
          <FeatureCard key={index} index={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
