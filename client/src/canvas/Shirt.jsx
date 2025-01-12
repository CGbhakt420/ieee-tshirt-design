import React from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {

    const snap = useSnapshot(state);  // Snapshot the current state from Valtio
    const { nodes, materials } = useGLTF('/shirt_baked.glb');  // Load the 3D shirt model
  
    // Load textures for logo and full decal
    const logoTexture = useTexture(snap.logoDecal); // AI-generated or user-uploaded logo decal
    const fullTexture = useTexture(snap.fullDecal); // Full texture (static or user-uploaded)
  
    // Smooth color transition for shirt (from snap.color state)
    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));
  
    return (
      <group>
        <mesh
          castShadow // Enables shadow casting for the shirt
          geometry={nodes.T_Shirt_male.geometry} // Shirt model geometry
          material={materials.lambert1} // Shirt material
          material-roughness={1} // Set roughness
          dispose={null}
        >
          {/* Conditionally render full texture */}
          {snap.isFullTexture && snap.fullDecal && (
            <Decal
              position={[0, 0, 0]} // Position of the full texture
              rotation={[0, 0, 0]} // No rotation
              scale={1} // Full coverage
              map={fullTexture} // Full texture (can be user-uploaded or default)
              map-anisotropy={16} // Improve texture quality
              depthTest={false} // Disable depth testing for better overlay
              depthWrite={true} // Enable depth writing
            />
          )}
  
          {/* Conditionally render logo texture (AI-generated or user-uploaded) */}
          {snap.isLogoTexture && snap.logoDecal && (
            <Decal
              position={[0, 0.04, 0.15]} // Position the logo slightly above the center of the shirt
              rotation={[0, 0, 0]} // No rotation
              scale={0.15} // Scale the logo to fit appropriately
              map={logoTexture} // Apply the AI-generated or uploaded logo texture
              depthTest={false} // Disable depth testing for logo
              depthWrite={true} // Enable depth writing for logo
            />
          )}
        </mesh>
      </group>
    );
  
  
};

export default Shirt;

