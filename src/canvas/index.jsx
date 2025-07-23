// src/canvas/index.jsx

import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import Shirt from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";

// The component now accepts a 'showBackground' prop, defaulting to false.
const CanvasModel = ({ showBackground = false, scrollYProgress }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      // Enable transparency on the canvas itself
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      
      {/* This is the corrected logic.
        - If showBackground is true, it renders the Environment with the visible background.
        - If false, it renders the Environment for lighting only (on a transparent canvas).
      */}
      <Environment preset="studio" background={showBackground} />

      <CameraRig scrollYProgress={scrollYProgress}>
        {/* The custom Backdrop is only shown on the customizer page */}
        {showBackground && <Backdrop />}
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default CanvasModel;
