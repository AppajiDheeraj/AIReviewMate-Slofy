"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextSection from "./AnimatedTextSection/AnimatedTextSection";
import CardAnimation from "./HeroCards/CardAnimation";

gsap.registerPlugin(ScrollTrigger);

const AnimationSequence = () => {
  const sequenceRef = useRef(null);

  // Refs for the children components
  const textSectionRef = useRef(null);
  const cardSectionRef = useRef(null);
  const cardHeaderRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  useLayoutEffect(() => {
    if (window.innerWidth <= 1000) return;

    const ctx = gsap.context(() => {
      // Set initial states: The card section is invisible and behind the text section.
      gsap.set(cardSectionRef.current, { autoAlpha: 0 });
      gsap.set(textSectionRef.current, { autoAlpha: 1 });

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sequenceRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 8}`, // 4vh for text, 4vh for cards
          pin: true,
          scrub: 1,
        },
      });

      // --- 1. TEXT ANIMATION ---
      masterTimeline.to(textSectionRef.current, {
        duration: 4,
        onUpdate: function () {
          const progress = this.progress();
          const allWords = textSectionRef.current.querySelectorAll(".word");
          const wordHighlightBgColor = "60, 60, 60";

          allWords.forEach((word, index) => {
            const wordText = word.querySelector("span");
            if (!wordText) return;

            if (progress <= 0.7) {
              const revealProgress = Math.min(1, progress / 0.7);
              const overlap = 15;
              const totalLength = 1 + overlap / allWords.length;
              const start = index / allWords.length;
              const end = start + overlap / allWords.length;
              const scale = 1 / totalLength;
              const adjStart = start * scale;
              const adjEnd = end * scale;
              const duration = adjEnd - adjStart;
              const wProgress = revealProgress <= adjStart ? 0 : revealProgress >= adjEnd ? 1 : (revealProgress - adjStart) / duration;

              word.style.opacity = wProgress;
              const fadeStart = wProgress >= 0.9 ? (wProgress - 0.9) / 0.1 : 0;
              const bgOpacity = Math.max(0, 1 - fadeStart);
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${bgOpacity})`;
              const txtProgress = wProgress >= 0.9 ? (wProgress - 0.9) / 0.1 : 0;
              wordText.style.opacity = Math.pow(txtProgress, 0.5);
            } else {
              const rev = (progress - 0.7) / 0.3;
              const revOverlap = 5;
              const rStart = index / allWords.length;
              const rEnd = rStart + revOverlap / allWords.length;
              const rScale = 1 / (1 + revOverlap / allWords.length);
              const adjStart = rStart * rScale;
              const adjEnd = rEnd * rScale;
              const duration = adjEnd - adjStart;
              const revProgress = rev <= adjStart ? 0 : rev >= adjEnd ? 1 : (rev - adjStart) / duration;

              if (revProgress > 0) {
                wordText.style.opacity = 1 - revProgress;
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${revProgress})`;
              } else {
                wordText.style.opacity = 1;
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
              }
            }
          });
        },
      });

      // --- 2. THE TRANSITION ---
      masterTimeline.to(textSectionRef.current, { autoAlpha: 0, duration: 0.1 });
      masterTimeline.to(cardSectionRef.current, { autoAlpha: 1, duration: 0.1 }, "<");

      // --- 3. CARD ANIMATION ---
      masterTimeline.to(cardSectionRef.current, {
        duration: 4,
        onUpdate: function () {
          const progress = this.progress();
          const smoothStep = (p) => p * p * (3 - 2 * p);

          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
          gsap.set(cardHeaderRef.current, { y: gsap.utils.interpolate("300%", "0%", smoothStep(headerProgress)) });

          const cardRefs = [card1Ref.current, card2Ref.current, card3Ref.current];
          cardRefs.forEach((card, index) => {
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
            const innerCard = card.querySelector(".flip-card-inner");
            let y, scale, opacity, x, rotate, rotationY;

            if (cardProgress < 0.4) {
              const norm = cardProgress / 0.4;
              y = gsap.utils.interpolate("-100%", "50%", smoothStep(norm));
              scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(norm));
            } else if (cardProgress < 0.6) {
              const norm = (cardProgress - 0.4) / 0.2;
              y = gsap.utils.interpolate("50%", "0%", smoothStep(norm));
              scale = gsap.utils.interpolate(0.75, 1, smoothStep(norm));
            } else { y = "0%"; scale = 1; }

            opacity = cardProgress < 0.2 ? smoothStep(cardProgress / 0.2) : 1;

            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const norm = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", smoothStep(norm));
              rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(norm));
              rotationY = smoothStep(norm) * 180;
            } else { x = "0%"; rotate = 0; rotationY = 180; }

            gsap.set(card, { opacity, y, x, rotate, scale });
            gsap.set(innerCard, { rotationY });
          });
        },
      });
    }, sequenceRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sequenceRef} style={{ position: "relative", height: "100vh", width: "100%" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <AnimatedTextSection ref={textSectionRef} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <CardAnimation
          ref={{
            componentRef: cardSectionRef,
            headerRef: cardHeaderRef,
            card1Ref,
            card2Ref,
            card3Ref,
          }}
        />
      </div>
    </div>
  );
};

export default AnimationSequence;
