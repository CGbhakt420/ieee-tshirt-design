// src/components/WavyBackground.jsx

import React, { useRef, useEffect } from 'react';

const BackgroundGradients = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const config = {
      lineCount: 80, // Number of lines
      amplitude: 150,  // How high the waves go
      frequency: 0.002, // How frequent the waves are
      phaseSpeed: 0.015, // How fast the animation moves
      lineWidth: 1,
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a color gradient from left to right
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0.2, '#ec4899'); // Pink/Magenta
      gradient.addColorStop(0.5, '#a855f7'); // Purple
      gradient.addColorStop(0.8, '#2dd4bf'); // Teal

      ctx.strokeStyle = gradient;
      ctx.lineWidth = config.lineWidth;

      // Draw each line
      for (let i = 0; i < config.lineCount; i++) {
        ctx.beginPath();
        const yOffset = (canvas.height / config.lineCount) * i + 50; // Start each line lower down

        for (let x = 0; x < canvas.width; x++) {
          // Calculate the y position using a sine wave
          // The wave is influenced by both x-position and the line index (i)
          const waveY = Math.sin(x * config.frequency + frame * config.phaseSpeed + i * 0.1) * config.amplitude;
          
          // The base position of the line curves up in the middle
          const baseCurve = (canvas.height / 2) - Math.pow(x / (canvas.width / 2) - 1, 2) * (canvas.height / 3);
          
          const finalY = baseCurve + waveY + yOffset;
          
          if (x === 0) {
            ctx.moveTo(x, finalY);
          } else {
            ctx.lineTo(x, finalY);
          }
        }
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-70" />;
};

export default BackgroundGradients;

// below For performance optimization

// import React, { useRef, useEffect } from 'react';

// const BackgroundGradients = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     let frame = 0;

//     // Configuration optimized for performance
//     const config = {
//       lineCount: 50,      // Reduced for fewer calculations
//       amplitude: 130,     // How high the waves go
//       frequency: 0.003,   // How frequent the waves are
//       phaseSpeed: 0.005,  // Slower animation is less demanding and smoother
//       lineWidth: 1.5,
//       step: 5,            // OPTIMIZATION: Calculate a point every 5 pixels instead of 1
//     };

//     let animationFrameId;

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     const draw = () => {
//       frame++;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
//       gradient.addColorStop(0.2, '#ec4899'); // Pink/Magenta
//       gradient.addColorStop(0.5, '#a855f7'); // Purple
//       gradient.addColorStop(0.8, '#2dd4bf'); // Teal

//       ctx.strokeStyle = gradient;
//       ctx.lineWidth = config.lineWidth;

//       for (let i = 0; i < config.lineCount; i++) {
//         ctx.beginPath();
//         const yOffset = (canvas.height / config.lineCount) * i + 40;

//         // Start the line from the first point
//         let x = 0;
//         let y = calculateY(x, i, yOffset);
//         ctx.moveTo(x, y);

//         // Draw the rest of the line in optimized steps
//         for (x = config.step; x < canvas.width + config.step; x += config.step) {
//           y = calculateY(x, i, yOffset);
//           ctx.lineTo(x, y);
//         }
//         ctx.stroke();
//       }

//       animationFrameId = requestAnimationFrame(draw);
//     };

//     const calculateY = (x, lineIndex, yOffset) => {
//         const waveY = Math.sin(x * config.frequency + frame * config.phaseSpeed + lineIndex * 0.1) * config.amplitude;
//         const baseCurve = (canvas.height / 2) - Math.pow(x / (canvas.width / 2) - 1, 2) * (canvas.height / 3.5);
//         return baseCurve + waveY + yOffset;
//     }

//     window.addEventListener('resize', resizeCanvas);
//     resizeCanvas();
//     draw();

//     // Cleanup function to stop the animation when the component is unmounted
//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed top-0 left-0 w-full h-full z-0 opacity-60"
//       // Performance hint for the browser
//       style={{ willChange: 'transform' }}
//     />
//   );
// };

// export default BackgroundGradients;
