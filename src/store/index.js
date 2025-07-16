import {proxy} from 'valtio';

const state = proxy({
  intro: true,
  color: '#353934',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './circuit.png',
  logoPosition: [0, 0.04, 0.15],
  logoRotation: [0, 0, 0],
  logoScale: 0.15,
  isDragging: false,
  isUIInteracting: false,
});

export default state;