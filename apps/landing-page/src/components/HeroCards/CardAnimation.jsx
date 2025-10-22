"use client";

import React, { forwardRef } from "react";
import "./CardAnimation.css";

const CardAnimation = forwardRef((props, ref) => {
  const { componentRef, headerRef, card1Ref, card2Ref, card3Ref } = ref;

  return (
    <section className="home-services" ref={componentRef}>
      <div className="home-services-header" ref={headerRef}>
        <p className="md">Empowering developers with smart, automated code reviews.</p>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">The Journey</h2>
      </div>
      <div className="cards">
        <div className="cards-container">
          <div className="card" id="card-1" ref={card1Ref}>
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title"><p className="mono">Analyze</p><p className="mono">01</p></div>
                  <div className="card-title"><p className="mono">01</p><p className="mono">Analyze</p></div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><p className="mono">Analyze</p><p className="mono">01</p></div>
                  <div className="card-copy"><p>Upload your repository or paste code.</p><p>AIReviewMate scans for issues, complexity, and readability.</p><p>Instant feedback on structure, syntax, and best practices.</p><p>Smart language detection for multi-stack projects.</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" id="card-2" ref={card2Ref}>
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title"><p className="mono">Improve</p><p className="mono">02</p></div>
                  <div className="card-title"><p className="mono">02</p><p className="mono">Improve</p></div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><p className="mono">Improve</p><p className="mono">02</p></div>
                  <div className="card-copy"><p>AI refactors inefficient code automatically.</p><p>Highlights performance and maintainability issues.</p><p>Generates cleaner, production-ready suggestions.</p><p>Real-time diff viewer for before-and-after comparison.</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" id="card-3" ref={card3Ref}>
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title"><p className="mono">Deploy</p><p className="mono">03</p></div>
                  <div className="card-title"><p className="mono">03</p><p className="mono">Deploy</p></div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><p className="mono">Deploy</p><p className="mono">03</p></div>
                  <div className="card-copy"><p>Commit AI-reviewed code directly to GitHub.</p><p>Create pull requests and track AI changes.</p><p>Seamless credit management and secure authentication.</p><p>Iterate faster — deploy with confidence and quality.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CardAnimation.displayName = "CardAnimation";
export default CardAnimation;
