"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import QRCode from "react-qr-code";

// --- Premium UX Component: Masked Text Reveal ---
const MaskedReveal = ({ 
  children, 
  progress, 
  input, 
  output 
}: { 
  children: React.ReactNode; 
  progress: MotionValue<number>; 
  input: number[]; 
  output: number[] 
}) => {
  const y = useTransform(progress, input, output);
  return (
    <div className="overflow-hidden pb-2 w-full flex justify-center">
      <motion.div style={{ y }} className="w-full flex flex-col items-center">
        {children}
      </motion.div>
    </div>
  );
};

// --- Premium UX Component: Cinematic Ambient Bokeh ---
// Creates out-of-focus, glowing light orbs that float with a 3D parallax effect
const AmbientBokeh = ({ progress, start, end }: { progress: MotionValue<number>, start: number, end: number }) => {
  // Parallax upward movement (moving at different speeds to create depth)
  const y1 = useTransform(progress, [start, end], [100, -200]);
  const y2 = useTransform(progress, [start, end], [250, -100]);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <motion.div style={{ y: y1 }} className="absolute w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] -ml-[25rem] mix-blend-screen" />
      <motion.div style={{ y: y2 }} className="absolute w-96 h-96 bg-amber-300/15 rounded-full blur-[100px] ml-[25rem] mt-[10rem] mix-blend-screen" />
    </motion.div>
  );
};

// --- Premium UX Component: Scroll-Drawn SVG Frame ---
// Physically traces a line around the card as you scroll
const AnimatedFrame = ({ progress, start, end, theme }: { progress: MotionValue<number>, start: number, end: number, theme: 'light' | 'dark' }) => {
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  const strokeColor = theme === 'dark' ? "rgba(253, 230, 138, 0.4)" : "rgba(217, 119, 6, 0.4)"; // amber-200 or amber-600

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ borderRadius: '0.75rem' }}>
      <motion.rect 
        x="0" y="0" width="100%" height="100%" 
        rx="12" ry="12"
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="2"
        style={{ pathLength }}
      />
    </svg>
  );
};

// --- Premium UX Component: Interactive Location Card ---
const LocationReveal = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Google Maps URL for Lakshmi Thirumana Nilayam, Villianur
  const mapsUrl = "https://maps.google.com/?q=Lakshmi+Thirumana+Nilayam,Villianur,Puducherry";

  // Dynamic classes based on the scene's background
  const btnClass = theme === 'dark' 
    ? "border-amber-200/50 text-amber-100 hover:bg-amber-900/40 hover:border-amber-200"
    : "border-amber-700/50 text-amber-900 hover:bg-amber-100 hover:border-amber-700";
    
  const panelClass = theme === 'dark'
    ? "bg-white/5 border-amber-900/30"
    : "bg-stone-100/80 border-stone-300";

  const textClass = theme === 'dark' ? "text-amber-200/70" : "text-stone-500";
  const linkClass = theme === 'dark' 
    ? "text-amber-400 hover:text-amber-200 decoration-amber-900" 
    : "text-amber-700 hover:text-amber-900 decoration-amber-300";

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-8 py-3 rounded-full border uppercase tracking-widest text-xs font-semibold transition-all duration-300 ${btnClass}`}
      >
        {isOpen ? "Hide Map" : "Get Directions"}
      </button>

      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? "1.5rem" : "0"
        }}
        className={`overflow-hidden p-6 rounded-2xl border backdrop-blur-xl flex flex-col items-center w-full max-w-xs ${panelClass}`}
      >
        <div className="bg-white p-3 rounded-xl shadow-inner mb-4">
          <QRCode 
            value={mapsUrl} 
            size={140}
            fgColor="#1c1917" 
            bgColor="#ffffff"
          />
        </div>
        <p className={`text-xs uppercase tracking-widest text-center mb-4 ${textClass}`}>
          Scan for Navigation
        </p>
        <a 
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm underline underline-offset-4 transition-colors ${linkClass}`}
        >
          Open in Google Maps
        </a>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target: June 6, 2026, 7:30 PM IST (We add +05:30 to lock it to Indian Standard Time)
    const targetDate = new Date("2026-06-06T19:30:00+05:30").getTime();
    
    const interval = setInterval(() => {
      // new Date().getTime() automatically gets the current absolute time
      const now = new Date().getTime(); 
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        // Optional: You can set all these to 0 when the time passes, or show a "Happening Now!" message
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // --- Scroll Animation Logic ---
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background slow zoom
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]); 

  // --- BACKGROUND CROSSFADES ---
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.16, 0.22], [1, 1, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.16, 0.22, 0.44, 0.48], [0, 1, 1, 0]);
  const bg3Opacity = useTransform(scrollYProgress, [0.44, 0.48, 0.70, 0.74], [0, 1, 1, 0]);
  const bg4Opacity = useTransform(scrollYProgress, [0.70, 0.74, 1], [0, 1, 1]);

  // --- SCENE TIMINGS ---
  
  // Scene 1: Hero
  const opacity1 = useTransform(scrollYProgress, [0, 0.12, 0.16], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.16], [0, -100]);
  const display1 = useTransform(scrollYProgress, (pos) => pos <= 0.18 ? "flex" : "none");

  // Scene 2: Our Story
  const opacity2 = useTransform(scrollYProgress, [0.22, 0.28, 0.38, 0.44], [0, 1, 1, 0]);
  const display2 = useTransform(scrollYProgress, (pos) => (pos >= 0.20 && pos <= 0.46) ? "flex" : "none");

  // Scene 3: Reception
  const opacity3 = useTransform(scrollYProgress, [0.48, 0.54, 0.64, 0.70], [0, 1, 1, 0]);
  const display3 = useTransform(scrollYProgress, (pos) => (pos >= 0.46 && pos <= 0.72) ? "flex" : "none");
  
  
  // Scene 4: Muhurtham
  const opacity4 = useTransform(scrollYProgress, [0.74, 0.80, 1], [0, 1, 1]);
  const display4 = useTransform(scrollYProgress, (pos) => pos >= 0.72 ? "flex" : "none");

  return (
    <ReactLenis root>
      <main ref={containerRef} className="h-[700vh] w-full bg-stone-950 relative selection:bg-amber-200/30">
        
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center text-stone-100">
          
          {/* --- CINEMATIC BACKGROUND STACK --- */}
          <motion.div className="absolute inset-0 z-0" style={{ scale: bgScale }}>
            <motion.div 
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: "url('/hero.JPG')", opacity: bg1Opacity }}
            />
            <motion.div 
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: "url('/ring.JPG')", opacity: bg2Opacity }}
            />
            <motion.div 
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: "url('/ring1.JPG')", opacity: bg3Opacity }}
            />
            <motion.div 
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: "url('/ring1.JPG')", opacity: bg4Opacity }}
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-0 pointer-events-none"></div>

          {/* --- SCENE 1: HERO & EXPLICIT SCROLL INDICATOR --- */}
          <motion.section 
            className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10"
            style={{ opacity: opacity1, y: y1, display: display1 }}
          >
            <p className="tracking-[0.3em] uppercase text-sm md:text-base mb-6 font-medium text-amber-200 drop-shadow-md">
              We Are Getting Married
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4 tracking-wide text-center text-amber-50 drop-shadow-xl">
              Vijay Prabhakar & Nivetha
            </h1>
            <p className="text-xl md:text-2xl font-light mb-12 text-amber-100 drop-shadow-md">
              June 6 & 7, 2026
            </p>

            <div className="flex space-x-6 md:space-x-12 text-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <span className="text-4xl md:text-6xl font-serif mb-2 w-16 md:w-24 text-amber-50 drop-shadow-lg">
                    {value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs md:text-sm uppercase tracking-widest text-amber-200/80 drop-shadow-md">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-12 flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-amber-200 mb-3 drop-shadow-md font-semibold">
                Scroll Down
              </p>
              <div className="w-8 h-12 border-2 border-amber-200 rounded-full flex justify-center pt-2 opacity-80">
                 <motion.div 
                   className="w-1.5 h-3 bg-amber-200 rounded-full"
                   animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                 />
              </div>
            </div>
          </motion.section>

          {/* --- SCENE 2: OUR STORY --- */}
          <motion.section 
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto z-10"
            style={{ opacity: opacity2, display: display2 }}
          >
            <MaskedReveal progress={scrollYProgress} input={[0.22, 0.28]} output={[100, 0]}>
              <h2 className="font-serif text-4xl md:text-6xl mb-8 text-amber-50 drop-shadow-xl">
                The Journey to "I Do"
              </h2>
            </MaskedReveal>

            <MaskedReveal progress={scrollYProgress} input={[0.24, 0.30]} output={[100, 0]}>
              <p className="text-lg md:text-xl leading-relaxed text-amber-100/90 font-light drop-shadow-md">
                Ever since we officially exchanged rings and promised forever on February 13th, 
                the countdown has been the most exciting time of our lives. Now, the big day is 
                finally approaching, and our celebration wouldn't be complete without the presence of 
                our family and closest friends.
              </p>
            </MaskedReveal>
          </motion.section>

          <motion.section 
            className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 w-full"
            style={{ opacity: opacity3, display: display3 }}
          >
            {/* The floating lights in the background */}
            <AmbientBokeh progress={scrollYProgress} start={0.46} end={0.72} />

            <div className="relative w-full max-w-2xl text-center bg-stone-900/60 p-12 md:p-16 rounded-xl backdrop-blur-md">
              
              {/* The SVG frame that draws itself around the card */}
              <AnimatedFrame progress={scrollYProgress} start={0.48} end={0.56} theme="dark" />

              <MaskedReveal progress={scrollYProgress} input={[0.48, 0.54]} output={[50, 0]}>
                <p className="tracking-[0.2em] uppercase text-sm mb-4 text-amber-200/80">Join us for</p>
              </MaskedReveal>

              <MaskedReveal progress={scrollYProgress} input={[0.50, 0.56]} output={[80, 0]}>
                <h2 className="font-serif text-5xl md:text-6xl mb-8 text-amber-50 drop-shadow-md">
                  The Reception
                </h2>
              </MaskedReveal>

              <MaskedReveal progress={scrollYProgress} input={[0.52, 0.58]} output={[50, 0]}>
                <div className="space-y-4 text-amber-50/90 mt-4 flex flex-col items-center w-full">
                  <p className="text-lg leading-relaxed text-amber-100 font-light mb-6">
                    A vibrant evening of music, dinner, and celebration to kick off the wedding festivities.
                  </p>
                  <p className="font-medium text-xl text-amber-200">Saturday, June 06, 2026</p>
                  <p className="text-lg">7:30 PM to 9:30 PM</p>
                  <div className="w-12 h-px bg-amber-700/50 mx-auto my-6"></div>
                  <p className="text-lg text-amber-100">Lakshmi Thirumana Nilayam</p>
                  <p className="text-amber-200/60">26, Villupuram Main Rd, Villianur</p>
                  
                  <LocationReveal theme="dark" />
                </div>
              </MaskedReveal>
            </div>
          </motion.section>

          {/* --- SCENE 4: MUHURTHAM --- */}
          <motion.section 
            className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 w-full"
            style={{ opacity: opacity4, display: display4 }}
          >
            {/* The floating lights in the background */}
            <AmbientBokeh progress={scrollYProgress} start={0.72} end={1} />

            {/* THE UPGRADE: Luxurious Glassmorphism Container */}
            <div className="relative w-full max-w-2xl text-center bg-white/5 p-12 md:p-16 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl border border-white/10">
              
              {/* The SVG frame matched to the dark glass theme */}
              <AnimatedFrame progress={scrollYProgress} start={0.74} end={0.82} theme="dark" />

              <MaskedReveal progress={scrollYProgress} input={[0.74, 0.80]} output={[50, 0]}>
                <p className="tracking-[0.2em] uppercase text-sm mb-4 text-amber-200/80">Witness our</p>
              </MaskedReveal>

              <MaskedReveal progress={scrollYProgress} input={[0.76, 0.82]} output={[80, 0]}>
                <h2 className="font-serif text-5xl md:text-6xl mb-8 text-amber-50 drop-shadow-md">
                  Marriage Muhurtham
                </h2>
              </MaskedReveal>

              <MaskedReveal progress={scrollYProgress} input={[0.78, 0.84]} output={[50, 0]}>
                <div className="space-y-4 text-amber-50/90 mt-4 flex flex-col items-center w-full">
                  <p className="text-lg leading-relaxed text-amber-100 font-light mb-6">
                    We request the honor of your presence and blessings as we traditionally tie the knot and step into our new life together.
                  </p>
                  <p className="font-semibold text-xl text-amber-200">Sunday, June 07, 2026</p>
                  <p className="text-lg">Morning Auspicious Time</p>
                  <div className="w-12 h-px bg-amber-700/50 mx-auto my-6"></div>
                  <p className="text-lg font-medium text-amber-100">Lakshmi Thirumana Nilayam</p>
                  <p className="text-amber-200/60">26, Villupuram Main Rd, Villianur</p>
                  
                  {/* Switched to dark theme so the Location button matches the glass */}
                  <LocationReveal theme="dark" />
                </div>
              </MaskedReveal>
            </div>
          </motion.section>

        </div>
      </main>
    </ReactLenis>
  );
}