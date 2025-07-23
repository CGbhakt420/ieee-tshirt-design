
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-8 rounded-2xl bg-gray-900 bg-opacity-50 border border-gray-700 shadow-lg text-center"
        >
            <div className="text-teal-400 mb-4 mx-auto w-fit">{/* {icon} */}</div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </motion.div>
    )
}

export default FeatureCard;