import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  const [isDragging, setIsDragging] = useState(false);
  const [pointerX, setPointerX] = useState(0);

  useEffect(() => {
    const handlePointerDown = () => {
      setIsDragging(true);
      state.isDragging = true; // <-- update Valtio state
    };
    const handlePointerUp = () => {
      setIsDragging(false);
      state.isDragging = false; // <-- update Valtio state
    };
    const handlePointerMove = (e) => {
      if (isDragging) {
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        setPointerX(normalizedX);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDragging]);

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) {
        targetPosition = [0, 0, 2.5];
      } else {
        targetPosition = [0, 0, 2];
      }
    }

    // smooth camera position transition
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // Only rotate if dragging and NOT interacting with UI
    if (snap.isDragging && !snap.isUIInteracting) {
      // rotate model only if dragging
      const targetRotationY = isDragging
        ? pointerX * Math.PI
        : group.current.rotation.y;
      easing.dampE(group.current.rotation, [0, targetRotationY, 0], 0.2, delta);
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
