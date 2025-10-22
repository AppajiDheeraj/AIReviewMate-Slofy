"use client";

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CardAnimation.css';

gsap.registerPlugin(ScrollTrigger);

const CardAnimation = () => {
  const componentRef = useRef(null);
  const cardsRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    if (window.innerWidth <= 1000) return; // Animations are for desktop

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: componentRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 4}`,
        pin: true,
        pinSpacing: true,
      });

      const smoothStep = (p) => p * p * (3 - 2 * p);

      ScrollTrigger.create({
        trigger: componentRef.current,
        start: 'top bottom',
        end: `+=${window.innerHeight * 4}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Animate header
          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
          const headerY = gsap.utils.interpolate('300%', '0%', smoothStep(headerProgress));
          gsap.set(headerRef.current, { y: headerY });

          const cardRefs = [card1Ref.current, card2Ref.current, card3Ref.current];

          cardRefs.forEach((card, index) => {
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));

            const innerCard = card.querySelector('.flip-card-inner');

            let y;
            if (cardProgress < 0.4) {
              const normalizedProgress = cardProgress / 0.4;
              y = gsap.utils.interpolate('-100%', '50%', smoothStep(normalizedProgress));
            } else if (cardProgress < 0.6) {
              const normalizedProgress = (cardProgress - 0.4) / 0.2;
              y = gsap.utils.interpolate('50%', '0%', smoothStep(normalizedProgress));
            } else {
              y = '0%';
            }

            let scale;
            if (cardProgress < 0.4) {
              const normalizedProgress = cardProgress / 0.4;
              scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(normalizedProgress));
            } else if (cardProgress < 0.6) {
              const normalizedProgress = (cardProgress - 0.4) / 0.2;
              scale = gsap.utils.interpolate(0.75, 1, smoothStep(normalizedProgress));
            } else {
              scale = 1;
            }

            let opacity;
            if (cardProgress < 0.2) {
              const normalizedProgress = cardProgress / 0.2;
              opacity = smoothStep(normalizedProgress);
            } else {
              opacity = 1;
            }

            let x, rotate, rotationY;
            if (cardProgress < 0.6) {
              x = index === 0 ? '100%' : index === 1 ? '0%' : '-100%';
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const normalizedProgress = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(
                index === 0 ? '100%' : index === 1 ? '0%' : '-100%',
                '0%',
                smoothStep(normalizedProgress)
              );
              rotate = gsap.utils.interpolate(
                index === 0 ? -5 : index === 1 ? 0 : 5,
                0,
                smoothStep(normalizedProgress)
              );
              rotationY = smoothStep(normalizedProgress) * 180;
            } else {
              x = '0%';
              rotate = 0;
              rotationY = 180;
            }

            gsap.set(card, {
              opacity: opacity,
              y: y,
              x: x,
              rotate: rotate,
              scale: scale,
            });

            gsap.set(innerCard, {
              rotationY: rotationY,
            });
          });
        },
      });
    }, componentRef);

    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  return (
    <div className="home-services-wrapper">
      {/* Added placeholder sections for scroll context */}
      <div className="placeholder-section" style={{ height: '100vh', background: '#f0f0f0' }}>
        <h1 style={{ textAlign: 'center', paddingTop: '40vh' }}>Scroll Down to See the Animation</h1>
      </div>

      <section className="home-services" ref={componentRef}>
        <div className="home-services-header" ref={headerRef}>
          <p className="md">Equipped and ready for scroll battles</p>
        </div>
        <div className="cards" ref={cardsRef}>
          <div className="cards-container">
            <div className="card" id="card-1" ref={card1Ref}>
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-title">
                      <p className="mono">Plan</p>
                      <p className="mono">01</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">01</p>
                      <p className="mono">Plan</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <p className="mono">Plan</p>
                      <p className="mono">01</p>
                    </div>
                    <div className="card-copy">
                      <p>Discovery</p><p>Audit</p><p>User Flow</p>
                      <p>Site Map</p><p>Personas</p><p>Strategy</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">01</p>
                      <p className="mono">Plan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" id="card-2" ref={card2Ref}>
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-title">
                      <p className="mono">Design</p>
                      <p className="mono">02</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">02</p>
                      <p className="mono">Design</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <p className="mono">Design</p>
                      <p className="mono">02</p>
                    </div>
                    <div className="card-copy">
                      <p>Wireframes</p><p>UI Kits</p><p>Prototypes</p>
                      <p>Visual Style</p><p>Interaction</p><p>Design QA</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">02</p>
                      <p className="mono">Design</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" id="card-3" ref={card3Ref}>
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-title">
                      <p className="mono">Develop</p>
                      <p className="mono">03</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">03</p>
                      <p className="mono">Develop</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <p className="mono">Develop</p>
                      <p className="mono">03</p>
                    </div>
                    <div className="card-copy">
                      <p>HTML/CSS/JS</p><p>CMS Build</p><p>GSAP Motion</p>
                      <p>Responsive</p><p>Optimization</p><p>Launch</p>
                    </div>
                    <div className="card-title">
                      <p className="mono">03</p>
                      <p className="mono">Develop</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="placeholder-section" style={{ height: '100vh', background: '#f0f0f0' }}>
        <h1 style={{ textAlign: 'center', paddingTop: '40vh' }}>End of Animation Section</h1>
      </div>
    </div>
  );
};

export default CardAnimation;
