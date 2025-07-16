import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/shirt_baked.glb");

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
  );

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* T-shirt full texture */}
        {snap.isFullTexture && (
          <meshStandardMaterial
            map={fullTexture}
            color={snap.color}
            roughness={1}
            attach="material"
          />
        )}

        {/* T-shirt logo on the front */}
        {snap.isLogoTexture && (
          <Decal
            position={snap.logoPosition}
            rotation={snap.logoRotation}
            scale={snap.logoScale}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {/* T-shirt logo on the back
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, -0.15]} // Back position
            rotation={[0, Math.PI, 0]} // Rotate 180 degrees for the back
            scale={0.15}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )} */}
      </mesh>
    </group>
  );
};

export default Shirt;
