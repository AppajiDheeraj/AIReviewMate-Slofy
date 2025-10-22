"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardAnimation.css";

gsap.registerPlugin(ScrollTrigger);

const CardAnimation = () => {
  const componentRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 1000) return;

    const ctx = gsap.context(() => {
      const section = componentRef.current;

      // ✅ Pin only the animation section (not the wrapper)
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      const smoothStep = (p) => p * p * (3 - 2 * p);

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: `+=${window.innerHeight * 4}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Animate header
          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
          const headerY = gsap.utils.interpolate("300%", "0%", smoothStep(headerProgress));
          gsap.set(headerRef.current, { y: headerY });

          const cardRefs = [card1Ref.current, card2Ref.current, card3Ref.current];
          cardRefs.forEach((card, index) => {
            if (!card) return;
            const innerCard = card.querySelector(".flip-card-inner");
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (0.9 - delay * 0.1)
            );

            // Animation logic
            const y = gsap.utils.interpolate("-100%", "0%", smoothStep(cardProgress));
            const scale = gsap.utils.interpolate(0.5, 1, smoothStep(cardProgress));
            const opacity = gsap.utils.interpolate(0, 1, smoothStep(cardProgress));

            gsap.set(card, { y, scale, opacity });
            gsap.set(innerCard, { rotationY: cardProgress * 180 });
          });
        },
      });

      // ✅ Force refresh after mount to avoid clipping
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }, componentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-services-wrapper">
      {/* ✅ Top Placeholder */}
      <section
        className="placeholder-section"
        style={{ height: "100vh", background: "#f0f0f0" }}
      >
        <h1 style={{ textAlign: "center", paddingTop: "40vh" }}>
          Scroll Down to See the Animation
        </h1>
      </section>

      {/* ✅ Main Pinned Animation */}
      <section className="home-services" ref={componentRef}>
        <div className="home-services-header" ref={headerRef}>
          <p className="md">Equipped and ready for scroll battles</p>
        </div>

        <div className="cards">
          <div className="cards-container">
            <div className="card" id="card-1" ref={card1Ref}>
              <div className="flip-card-inner">Card 1</div>
            </div>
            <div className="card" id="card-2" ref={card2Ref}>
              <div className="flip-card-inner">Card 2</div>
            </div>
            <div className="card" id="card-3" ref={card3Ref}>
              <div className="flip-card-inner">Card 3</div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Bottom Placeholder */}
      <section
        className="placeholder-section"
        style={{ height: "100vh", background: "#f0f0f0" }}
      >
        <h1 style={{ textAlign: "center", paddingTop: "40vh" }}>
          End of Animation Section
        </h1>
      </section>
    </div>
  );
};

export default CardAnimation;
