// src/pages/Home.jsx

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import CanvasModel from "../canvas";
import Navbar from "../components/Navbar";
import BackgroundGradients from "../components/BackgroundGradients"; // Import the new component

// Import your page sections
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Showcase from "../sections/Showcase";
import HowItWorks from "../sections/HowItWorks";
import Footer from "../sections/Footer";

const Home = () => {
  const scrollRef = useRef(null);

  // Hook to track scroll progress for animations
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Set the dark theme for the page
  useEffect(() => {
    document.body.style.backgroundColor = "#101010";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div
      className="w-full h-screen overflow-y-auto overflow-x-hidden"
      ref={scrollRef}
    >
      {/* 1. Animated Gradient Background (Lowest Layer) */}
      <BackgroundGradients />

      {/* 2. 3D Canvas Model (On top of gradients) */}
      <div className="fixed top-0 left-0 w-full h-full z-1">
        <CanvasModel scrollYProgress={scrollYProgress} />
      </div>

      {/* 4. Navbar (Highest Layer) */}
      <Navbar />

      {/* 3. Main Scrollable Content (On top of canvas) */}
      <main className="relative z-10">
        <Hero />
        <Features />
        <Showcase />
        <HowItWorks />
        <Footer />
      </main>
    </div>
  );
};

export default Home;
