import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <Canvas
    shadows
    camera={{ position: [0, 0, 0], fov: 25 }}//to expand the shirt
    gl={{ preserveDrawingBuffer: true }}//preserves the buffer
    className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      <CameraRig>{/*bring the camera close so shirt appears larger}*/}{/*passes <Center> and <Shirt> as children*/}
        
        <Backdrop />
        <Center>{/*to display shirt in center of the screen}*/}
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel
