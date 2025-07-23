// src/canvas/CameraRig.jsx

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children, scrollYProgress }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  // --- Drag-to-rotate state and logic ---
  const [isDragging, setIsDragging] = useState(false);
  const lastPointerX = useRef(0);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const handlePointerDown = (e) => {
      setIsDragging(true);
      state.isDragging = true;
      lastPointerX.current = e.clientX; // Store the initial pointer position
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      state.isDragging = false;
    };

    const handlePointerMove = (e) => {
      if (isDragging) {
        // Calculate the change in X position since the last frame
        const deltaX = e.clientX - lastPointerX.current;
        
        // Update the rotation based on the change (delta)
        // This allows for continuous rotation
        group.current.rotation.y += (deltaX / window.innerWidth) * Math.PI * 2;
        
        // Update the last pointer position for the next frame
        lastPointerX.current = e.clientX;
      }
    };

    // Add event listeners to the canvas
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp); // Listen on window to catch mouse up anywhere
    window.addEventListener('pointermove', handlePointerMove); // Listen on window for smooth dragging

    return () => {
      // Cleanup event listeners
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isDragging]);


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
    // 2. If the user IS dragging, the pointermove event handler takes control of rotation.
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
