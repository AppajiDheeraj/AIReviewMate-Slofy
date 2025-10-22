"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import "./AnimatedTextSection.css";

const AnimatedTextSection = forwardRef((props, ref) => {
  const paragraphsRef = useRef([]);

  useEffect(() => {
    const keywords = ["ai", "automation", "secure", "collaboration", "efficient", "smart", "developer"];
    paragraphsRef.current.forEach((p) => {
      if (!p || p.getAttribute("data-processed")) return;
      const text = p.textContent;
      const words = text.split(/\s+/);
      p.innerHTML = "";
      words.forEach((word) => {
        if (word.trim()) {
          const wordContainer = document.createElement("div");
          wordContainer.className = "word";
          const wordText = document.createElement("span");
          wordText.textContent = word;
          const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
          if (keywords.includes(normalizedWord)) {
            wordContainer.classList.add("keyword-wrapper");
            wordText.classList.add("keyword", normalizedWord);
          }
          wordContainer.appendChild(wordText);
          p.appendChild(wordContainer);
        }
      });
      p.setAttribute("data-processed", "true");
    });
  }, []);

  return (
    <div className="animated-text-wrapper" ref={ref}>
      <section id="animated-text-section" className="about anime-text-container">
        <div className="copy-container">
          <div className="anime-text">
            <p ref={(el) => (paragraphsRef.current[0] = el)}>
              AIReviewMate is an intelligent platform that simplifies code reviews through automation, precision, and smart insight. It helps developers identify bugs, improve readability, and enforce best practices effortlessly.
            </p>
            <p ref={(el) => (paragraphsRef.current[1] = el)}>
              Built for collaboration, AIReviewMate bridges developers and reviewers with clarity, secure automation, and consistent feedback. With every intelligent review, your workflow becomes faster, cleaner, and more efficient.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

AnimatedTextSection.displayName = "AnimatedTextSection";
export default AnimatedTextSection;
