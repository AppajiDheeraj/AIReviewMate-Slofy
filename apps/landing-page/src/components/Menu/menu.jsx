"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import './menu.css';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const Menu = () => {
    const menuRef = useRef(null);
    const menuOverlayRef = useRef(null);
    const menuItemsRef = useRef([]);
    const menuFooterRef = useRef(null);
    const menuLogoRef = useRef(null);
    const hamburgerMenuRef = useRef(null);
    const timeRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const isAnimating = useRef(false);
    const splitTexts = useRef([]);
    const footerSplitTexts = useRef([]);

    // Scramble Text Animation
    const scrambleText = (elements) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        elements.forEach((char) => {
            const originalText = char.textContent;
            let iterations = 0;
            const maxIterations = Math.floor(Math.random() * 6) + 3;

            gsap.set(char, { opacity: 1 });

            const scrambleInterval = setInterval(() => {
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                if (++iterations >= maxIterations) {
                    clearInterval(scrambleInterval);
                    char.textContent = originalText;
                }
            }, 35);
        });
    };
    
    // Initial Setup Effect
    useEffect(() => {
        // Set initial states
        gsap.set(menuOverlayRef.current, { scaleY: 0, transformOrigin: 'top center' });
        gsap.set(menuFooterRef.current, { opacity: 0, y: 20 });

        // Split menu link text
        menuItemsRef.current.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const split = new SplitText(link, { type: 'words', wordsClass: "word" });
                splitTexts.current.push(split);
                gsap.set(split.words, { yPercent: 120 });
            }
        });
        gsap.set(menuItemsRef.current, { opacity: 1 });

        // Split footer text
        const footerElements = menuFooterRef.current.querySelectorAll('.menu-social a, .menu-social span, .menu-time');
        footerElements.forEach(element => {
            const split = new SplitText(element, { type: 'chars' });
            footerSplitTexts.current.push(split);
            gsap.set(split.chars, { opacity: 0 });
        });

        // Scroll handler
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                menuRef.current.classList.add('hidden');
            } else {
                menuRef.current.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        
        // Time updater
        const updateTime = () => {
            if (timeRef.current) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                timeRef.current.textContent = `${timeString} LOCAL`;
            }
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(timeInterval);
            splitTexts.current.forEach(s => s.revert());
            footerSplitTexts.current.forEach(s => s.revert());
        };
    }, []);

    // Open Menu Animation
    const openMenu = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setIsOpen(true);

        const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });

        tl.to(menuOverlayRef.current, { duration: 0.5, scaleY: 1, ease: 'power3.out' });

        const allWords = splitTexts.current.flatMap(s => s.words);
        tl.to(allWords, { duration: 0.75, yPercent: 0, stagger: 0.05, ease: 'power4.out' }, '-=0.3');

        tl.to(menuFooterRef.current, {
            duration: 0.4,
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            onComplete: () => {
                const allFooterChars = footerSplitTexts.current.flatMap(s => s.chars);
                allFooterChars.forEach((char, index) => {
                    setTimeout(() => scrambleText([char]), index * 30);
                });
            }
        }, '-=0.75');
    };

    // Close Menu Animation
    const closeMenu = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setIsOpen(false);

        const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });

        tl.to(menuFooterRef.current, { duration: 0.3, y: 20, opacity: 0, ease: 'power2.in' });
        
        const allWords = splitTexts.current.flatMap(s => s.words);
        tl.to(allWords, { duration: 0.25, yPercent: 120, stagger: -0.025, ease: 'power2.in' }, '-=0.25');

        tl.to(menuOverlayRef.current, { duration: 0.5, scaleY: 0, ease: 'power3.inOut' }, '-=0.2');
    };

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };
    
    return (
      <nav className="menu" ref={menuRef}>
        <div className="menu-header" onClick={toggleMenu}>
          <a href="#" className="menu-logo">
            <Image
              src="/global/logo.png"
              alt="Logo"
              width={20}
              height={20}
              ref={menuLogoRef}
              className={isOpen ? "rotated" : ""}
            />
          </a>
          <button className="menu-toggle" aria-label="Toggle menu">
            <div
              ref={hamburgerMenuRef}
              className={`menu-hamburger-icon ${isOpen ? "open" : ""}`}
            >
              <span className="menu-item"></span>
              <span className="menu-item"></span>
            </div>
          </button>
        </div>
        <div className="menu-overlay" ref={menuOverlayRef}>
          <nav className="menu-nav">
            <ul>
              {/* Item 1: Index - Links to your main portfolio page */}
              <li key="Index" ref={(el) => (menuItemsRef.current[0] = el)}>
                <a href="https://dheerajtech-portfolio.netlify.app/">Index</a>
              </li>

              {/* Item 2: The Dev - Could be an 'About Me' section */}
              <li key="The Dev" ref={(el) => (menuItemsRef.current[1] = el)}>
                <a href="https://x.com/appaji_dhe22452">The Dev</a>
              </li>

              {/* Item 3: Cool Stuff - Links to your projects/portfolio section */}
              <li key="Cool Stuff" ref={(el) => (menuItemsRef.current[2] = el)}>
                <a href="https://dheerajtech-portfolio.netlify.app/#projects">
                  Cool Stuff
                </a>
              </li>

              {/* Item 4: Dashboard/Login - Redirects to a login page */}
              <li key="Dashboard" ref={(el) => (menuItemsRef.current[3] = el)}>
                <a href="/login">Dashboard</a>
              </li>

              {/* Item 5: Ping Me - Links to your GitHub profile */}
              <li key="Ping Me" ref={(el) => (menuItemsRef.current[4] = el)}>
                <a
                  href="https://github.com/AppajiDheeraj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ping Me
                </a>
              </li>
            </ul>
          </nav>

          <div className="menu-footer" ref={menuFooterRef}>
            <div className="menu-social">
              <a href="https://www.instagram.com/appaji_dheeraj/">
                <span>&#9654;</span> Instagram
              </a>
              <a href="https://www.linkedin.com/in/appaji-dheeraj/">
                <span>&#9654;</span> LinkedIn
              </a>
            </div>
            <div className="menu-time" ref={timeRef}></div>
          </div>
        </div>
      </nav>
    );
};

export default Menu;
