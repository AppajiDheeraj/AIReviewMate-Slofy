// src/components/Footer/Footer.js

"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
    const footerRef = useRef(null);
    const explosionContainerRef = useRef(null);
    const hasExploded = useRef(false);

    useEffect(() => {
        const footer = footerRef.current;
        const explosionContainer = explosionContainerRef.current;
        if (!footer || !explosionContainer) return;

        // --- Animation Configuration ---
        const config = {
            gravity: 0.25,
            friction: 0.99,
            imageSize: 150,
            horizontalForce: 20,
            verticalForce: 15,
            rotationSpeed: 10,
        };

        const imageParticleCount = 10;
        const imagePaths = Array.from(
            { length: imageParticleCount },
            (_, i) => `/images/work-items/work-item-${i + 1}.jpg`
        );

        // Preload images
        imagePaths.forEach((path) => {
            const img = new window.Image();
            img.src = path;
        });

        // --- Particle Class ---
        class Particle {
            constructor(element) {
                this.element = element;
                this.x = 0;
                this.y = 0;
                this.vx = (Math.random() - 0.5) * config.horizontalForce;
                this.vy = -config.verticalForce - Math.random() * 10;
                this.rotation = 0;
                this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
            }

            update() {
                this.vy += config.gravity;
                this.vx *= config.friction;
                this.vy *= config.friction;
                this.rotationSpeed *= config.friction;

                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;

                this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
            }
        }

        // --- Explode Function ---
        const explode = () => {
            if (hasExploded.current) return;
            hasExploded.current = true;

            // Clear previous particles and create new ones
            explosionContainer.innerHTML = "";
            const particleElements = imagePaths.map(path => {
                const particle = document.createElement('img');
                particle.src = path;
                particle.className = 'explosion-particle-img';
                particle.style.width = `${config.imageSize}px`;
                explosionContainer.appendChild(particle);
                return particle;
            });

            const particles = particleElements.map(element => new Particle(element));

            const animate = () => {
                particles.forEach(p => p.update());
                const animationId = requestAnimationFrame(animate);

                if (particles.every(p => p.y > explosionContainer.offsetHeight / 2)) {
                    cancelAnimationFrame(animationId);
                }
            };
            animate();
        };

        // --- Scroll and Resize Handlers ---
        const checkFooterPosition = () => {
            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (footerRect.top > viewportHeight + 100) {
                hasExploded.current = false;
            }

            if (!hasExploded.current && footerRect.top <= viewportHeight + 250) {
                explode();
            }
        };

        let checkTimeout;
        const handleScroll = () => {
            clearTimeout(checkTimeout);
            checkTimeout = setTimeout(checkFooterPosition, 5);
        };

        const handleResize = () => {
            hasExploded.current = false;
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        // Initial check
        setTimeout(checkFooterPosition, 500);

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(checkTimeout);
        };
    }, []);

    return (
        <footer id="page-footer" ref={footerRef}>
            <div className="footer-container">
                <div className="footer-symbols footer-symbols-1">
                    <img src="/images/global/s6.png" alt="Symbol" />
                    <img src="/images/global/s6.png" alt="Symbol" />
                </div>
                <div className="footer-symbols footer-symbols-2">
                    <img src="/images/global/s6.png" alt="Symbol" />
                    <img src="/images/global/s6.png" alt="Symbol" />
                </div>

                <div className="footer-header">
                    <h1>Appaji Dheeraj</h1>
                </div>

                <div className="footer-row">
                    <div className="footer-col">
                        <p>Quick Jumps</p>
                        <p><Link href="https://dheerajtech-portfolio.netlify.app/">Portfolio</Link></p>
                        <p><Link href="https://dheerajtech-portfolio.netlify.app/">About</Link></p>
                        <p><Link href="https://dheerajtech-portfolio.netlify.app/">Contact</Link></p>
                    </div>
                    <div className="footer-col">
                        <p>Side Streets</p>
                        <p>Drawing</p>
                        <p>Gardening</p>
                        <p>Napper</p>
                    </div>
                    <div className="footer-col">
                        <p>Social Signals</p>
                        <p><a href="https://www.instagram.com/appaji_dheeraj/" target="_blank" rel="noopener noreferrer">Instagram</a></p>
                        <p><a href="https://www.linkedin.com/in/appaji-dheeraj/" target="_blank" rel="noopener noreferrer">Linkedin</a></p>
                        <p><a href="https://github.com/AppajiDheeraj" target="_blank" rel="noopener noreferrer">Github</a></p>
                    </div>
                    <div className="footer-col">
                        <p>Alt Dimensions</p>
                        <p>UI UX Design</p>
                        <p>Web Development</p>
                    </div>
                </div>

                <div className="copyright-info">
                    <p className="mn">2025</p>
                    <p className="mn">//</p>
                    <p className="mn">
                       Made with love 💖 and passion
                    </p>
                </div>
                
                <div className="explosion-container" ref={explosionContainerRef}></div>
            </div>
        </footer>
     );
};

export default Footer;
