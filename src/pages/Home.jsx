import { useSnapshot } from 'valtio';
import state from '../store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import Canvas from '../canvas';
import {
  slideAnimation,
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from '../config/motion';

const Home = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="relative w-full h-screen overflow-hidden">
     
      <Canvas />

      <motion.section
        className="absolute top-0 left-0 h-full w-[40%] z-10 flex flex-col justify-center px-12 bg-transparent text-white"
        {...slideAnimation('left')}
      >
    
        <motion.header
          className="absolute top-6 left-6"
          {...slideAnimation('down')}
        >
          <img src="./threejs.png" alt="logo" className="w-10 h-10 object-contain" />
        </motion.header>

      
        <motion.div {...headContainerAnimation}>
          <motion.div {...headTextAnimation}>
            <h1 className="text-9xl font-extrabold leading-tight mb-6">
              LET'S <br /> DO IT.
            </h1>
          </motion.div>

          <motion.div {...headContentAnimation} className="space-y-6">
            <p className="text-gray-300">
              Create your own unique and stylish shirt with our brand-new 3D customization tool.
              <strong className="text-white"> Unleash your imagination </strong> and define your style.
            </p>

            <CustomButton
              type="filled"
              title="Customize It"
              handleClick={() => navigate('/customizer')}
              customStyles="px-6 py-3 font-bold text-sm w-fit bg-teal-500 hover:bg-teal-400 transition"
            />
          </motion.div>
        </motion.div>
      </motion.section>

  
      <div className="absolute top-4 right-4 z-20 flex gap-4">
        {isLoggedIn ? (
          <button
            onClick={() => navigate('/saved-designs')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition"
          >
            Dashboard
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-teal-500 border border-teal-400 px-4 py-2 rounded-lg font-semibold hover:bg-teal-800/20 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-400 transition"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
