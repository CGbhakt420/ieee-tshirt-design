import React, { useRef } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';//for shadow

const Backdrop = () => {
  const shadows = useRef();
  return (
    <AccumulativeShadows
    ref={shadows}//reference the shadow
    temporal//smooth out the edges
    frames={60}//frames are going to render in 60 frames
    alphaTest={0.85}//transparency of shadow
    scae={10}
    rotation={[Math.PI / 2, 0, 0]}
    position={[0, 0, -0.14]}
    >
      <RandomizedLight //shadow on left right of shirt
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
        />
      <RandomizedLight //shadow on right side of shirt
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  )
}

export default Backdrop