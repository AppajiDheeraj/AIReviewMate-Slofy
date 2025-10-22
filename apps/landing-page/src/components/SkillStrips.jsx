"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// This component encapsulates the entire "outro" section you provided.
const SkillStrips = () => {
  const componentRef = useRef(null);
  const stripsRef = useRef([]);

  useLayoutEffect(() => {
    // This GSAP animation is taken directly from the logic you provided.
    // It makes the strips of skills scroll horizontally as the user scrolls down.
    const ctx = gsap.context(() => {
      const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25]; // Speeds for each strip

      ScrollTrigger.create({
        trigger: componentRef.current,
        start: "top bottom", // Start when the top of the section hits the bottom of the screen
        end: "bottom top", // End when the bottom of the section hits the top of the screen
        scrub: 1.5, // Smoothly ties the animation to the scrollbar
        onUpdate: (self) => {
          const progress = self.progress;
          stripsRef.current.forEach((strip, index) => {
            if (strip && stripSpeeds[index] !== undefined) {
              const speed = stripSpeeds[index];
              const movement = progress * 100 * speed; // Calculate movement based on scroll progress
              gsap.set(strip, { x: `${movement}%` });
            }
          });
        },
      });
    }, componentRef);

    return () => ctx.revert(); // Cleanup GSAP animations on unmount
  }, []);

  return (
    // This is the exact HTML structure you provided, converted to JSX.
    <section className="outro-section" ref={componentRef}>
      <div className="outro-container">
        <h2>Build With Intelligence</h2><br />
        <h4>Automate. Review. Deploy.</h4>
      </div>
      <div className="outro-strips">
        <div className="outro-strip os-1" ref={el => stripsRef.current[0] = el}>
          <div className="skill skill-var-1"><p className="mono">Frontend</p></div>
          <div className="skill skill-var-2"><p className="mono">UX</p></div>
          <div className="skill skill-var-3"><p className="mono">Vibe Check</p></div>
          <div className="skill skill-var-1"><p className="mono">Clean Code</p></div>
          <div className="skill skill-var-3"><p className="mono">Creative Flow</p></div>
          <div className="skill skill-var-1"><p className="mono">Pixel Logic</p></div>
        </div>
        <div className="outro-strip os-2" ref={el => stripsRef.current[1] = el}>
          <div className="skill skill-var-2"><p className="mono">Motion</p></div>
          <div className="skill skill-var-3"><p className="mono">Taste</p></div>
          <div className="skill skill-var-1"><p className="mono">Grid Game</p></div>
        </div>
        <div className="outro-strip os-3" ref={el => stripsRef.current[2] = el}>
          <div className="skill skill-var-2"><p className="mono">Details</p></div>
          <div className="skill skill-var-3"><p className="mono">Toronto Core</p></div>
          <div className="skill skill-var-1"><p className="mono">Builds</p></div>
          <div className="skill skill-var-2"><p className="mono">Case Studies</p></div>
          <div className="skill skill-var-3"><p className="mono">Scroll Love</p></div>
          <div className="skill skill-var-3"><p className="mono">Easings</p></div>
          <div className="skill skill-var-1"><p className="mono">HTML Mindset</p></div>
        </div>
        <div className="outro-strip os-4" ref={el => stripsRef.current[3] = el}>
          <div className="skill skill-var-1"><p className="mono">Type Systems</p></div>
          <div className="skill skill-var-2"><p className="mono">Keyframes</p></div>
          <div className="skill skill-var-3"><p className="mono">Component Life</p></div>
        </div>
        <div className="outro-strip os-5" ref={el => stripsRef.current[4] = el}>
          <div className="skill skill-var-1"><p className="mono">Side Projects</p></div>
          <div className="skill skill-var-2"><p className="mono">Studio Vibes</p></div>
          <div className="skill skill-var-3"><p className="mono">GSAP Fanboy</p></div>
          <div className="skill skill-var-1"><p className="mono">No Filler</p></div>
          <div className="skill skill-var-2"><p className="mono">Live Sites</p></div>
          <div className="skill skill-var-3"><p className="mono">Canada Mode</p></div>
          <div className="skill skill-var-1"><p className="mono">Launch Ready</p></div>
          <div className="skill skill-var-2"><p className="mono">CodegridPRO</p></div>
        </div>
        <div className="outro-strip os-6" ref={el => stripsRef.current[5] = el}>
          <div className="skill skill-var-3"><p className="mono">UI Nerd</p></div>
          <div className="skill skill-var-1"><p className="mono">Quietly Bold</p></div>
          <div className="skill skill-var-2"><p className="mono">Shipped</p></div>
          <div className="skill skill-var-3"><p className="mono">Real CSS</p></div>
        </div>
      </div>
    </section>
  );
};

export default SkillStrips;
