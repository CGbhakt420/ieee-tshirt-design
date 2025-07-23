// src/canvas/CameraRig.jsx

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children, scrollYProgress }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  // --- Drag-to-rotate state and logic from your code ---
  const [isDragging, setIsDragging] = useState(false);
  const [initialPointerX, setInitialPointerX] = useState(0);
  const [initialRotationY, setInitialRotationY] = useState(0);

  useEffect(() => {
    const handlePointerDown = (e) => {
      setIsDragging(true);
      state.isDragging = true;
      setInitialPointerX(e.clientX);
      setInitialRotationY(group.current.rotation.y);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      state.isDragging = false;
    };

    const handlePointerMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - initialPointerX;
        // Adjust rotation based on drag distance
        group.current.rotation.y = initialRotationY + (deltaX / window.innerWidth) * Math.PI;
      }
    };

    const canvas = document.querySelector('canvas');
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isDragging, initialPointerX, initialRotationY]);


  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // Set camera position (this logic remains the same)
    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2];
    }
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);


    // --- MERGED ROTATION AND POSITION LOGIC ---

    // 1. If the user is NOT dragging, apply scroll and mouse-pointer animations
    if (!isDragging) {
      let targetRotationY = -state.pointer.x / 5;
      let targetPositionY = 0;

      // Apply scroll-based animation if scrollYProgress is available
      if (scrollYProgress) {
        const scroll = scrollYProgress.get();
        targetRotationY += -scroll * Math.PI * 0.5; // Add scroll rotation
        targetPositionY = -scroll * 0.5; // Add scroll position
      }
      
      // Smoothly animate to the target rotation and position
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, targetRotationY, 0],
        0.25,
        delta
      );
      easing.damp3(
        group.current.position,
        [0, targetPositionY, 0],
        0.25,
        delta
      );
    }
    // 2. If the user IS dragging, the pointermove event handler takes control of rotation,
    // so we don't need to do anything here for rotation.
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
