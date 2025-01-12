import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {
    const snap=useSnapshot(state)
    const { nodes, materials } = useGLTF('/shirt_baked.glb');//import the 3d shirt folder

    const logoTexture = useTexture(snap.logoDecal);//textture applied on tshirt on middle of the screen to a regular png img
    const fullTexture = useTexture(snap.fullDecal);//texture applied on full view of tshirt

    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));//to apply color smoothly on tshirt

    const stateString = JSON.stringify(snap);//tracks changes done on shirt
  return (
    <group key={stateString}/*renders when state changes*/
    >
        <mesh
            castShadow//will cast shadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}//material used for shirt
            material-roughness={1}
            dispose={null}
        >
            {/*to show full texture,to not show full texture,to show/not show logo on shirt
            in state isLogoTexture,isFullTexture values can be toggled acc to which here efeect will be shown*/}
            {snap.isFullTexture && (
                <Decal
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={1}//take full space of model
                map={fullTexture}//render the full texture
                map-anisotropy={16}//change qualtiy of texture
                depthTest={false}/*turn off tthis feature for displaying logo on shirt*/
                depthWrite={true}
                />
            )}
             {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
          />
        )}
        </mesh>
    </group>
  )
}

export default Shirt