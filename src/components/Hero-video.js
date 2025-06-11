import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoHero = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const floatingElements = useRef([]);
  const particlesRef = useRef([]);
  const overlayRef = useRef(null);

  const particleShapes = ['●', '◆', '▲', '■', '★'];
  const particleColors = ['#ff5f5f', '#5f9fff', '#5fff9f', '#ff5fff', '#ffff5f'];

  const createFloatingElements = useCallback(() => {
    return Array.from({ length: window.innerWidth < 768 ? 12 : 25 }, (_, i) => {
      const el = document.createElement('div');
      el.className = `float-element element-${i % 5}`;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = particleShapes[i % 5];
      el.style.color = particleColors[i % 5];
      containerRef.current.appendChild(el);
      return el;
    });
  }, []);

  const createParticles = useCallback(() => {
    return Array.from({ length: window.innerWidth < 768 ? 30 : 60 }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'particle';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = particleShapes[i % 5];
      el.style.color = particleColors[i % 5];
      containerRef.current.appendChild(el);
      return el;
    });
  }, []);

  useEffect(() => {
    floatingElements.current = createFloatingElements();
    particlesRef.current = createParticles();

    // Floating animations
    floatingElements.current.forEach((el, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = window.innerWidth < 768 ? 25 + Math.random() * 40 : 40 + Math.random() * 80;

      gsap.to(el, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: 360 * (i % 2 ? 1 : -1),
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Particle animations
    particlesRef.current.forEach((el, i) => {
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 1.5;
      const endY = -100;
      const duration = 12 + Math.random() * 12;

      gsap.set(el, {
        x: startX,
        y: startY,
        opacity: 0.2 + Math.random() * 0.3,
        scale: 0.4 + Math.random() * 0.6,
      });

      gsap.to(el, {
        y: endY,
        x: startX + (Math.random() - 0.5) * 80,
        duration: duration,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 3,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 0.3,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    });

    // Scroll-based animations
    gsap.to(videoRef.current, {
      scale: 1.25,
      filter: 'blur(3px) brightness(0.75)',
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 0.5,
        start: 'top top',
        end: 'bottom bottom',
      },
    });

    gsap.to(contentRef.current, {
      opacity: 0,
      y: -120,
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 1,
        start: 'center center',
        end: 'bottom top',
      },
    });

    gsap.to(overlayRef.current, {
      backgroundColor: 'rgba(10, 20, 40, 0.9)',
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 1,
        start: 'top top',
        end: 'bottom bottom',
      },
    });

    // Surprise element
    const surpriseElement = document.createElement('div');
    surpriseElement.className = 'surprise-element';
    surpriseElement.innerHTML = '🚀 Start Your Coding Journey Today!';
    surpriseElement.setAttribute('role', 'alert');
    containerRef.current.appendChild(surpriseElement);

    gsap.fromTo(
      surpriseElement,
      { y: 250, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '75% bottom',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Initial animations
    const tl = gsap.timeline();
    gsap.set(videoRef.current, { scale: 1.15, opacity: 0 });

    tl.to(videoRef.current, { opacity: 1, duration: 1.6, ease: 'power2.out' })
      .from(
        '.hero-title span',
        {
          y: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'back.out(2)',
        },
        '-=1'
      )
      .from(
        '.underline',
        {
          scaleX: 0,
          duration: 1.5,
          ease: 'expo.out',
        },
        '-=0.9'
      )
      .from(
        '.scroll-indicator',
        {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
        },
        '-=0.6'
      );

    // Resize handler
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      floatingElements.current.forEach((el) => el.remove());
      particlesRef.current.forEach((el) => el.remove());
      surpriseElement.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [createFloatingElements, createParticles]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      ref={containerRef}
      aria-label="Hero video section"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 transition-colors duration-300"
        ref={overlayRef}
      />
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%25%22%20height%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.12%22%2F%3E%3C%2Fsvg%3E')]"
        aria-hidden="true"
      ></div>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" autoPlay controls />
        Your browser does not support the video tag.
      </video>
      <div
        className="relative z-30 text-center text-white px-4 sm:px-6 max-w-6xl mx-auto"
        ref={contentRef}
      >
        <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase">
          <span className="title-part inline-block drop-shadow-md">CodeBuild</span>
          <span className="title-part inline-block text-red-400 ml-2 sm:ml-3">Academy</span>
          <div className="underline h-1 md:h-1.5 bg-gradient-to-r from-red-500 to-blue-500 w-28 sm:w-40 mx-auto mt-3 sm:mt-5" />
        </h1>
        <div className="scroll-indicator absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="mouse w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full relative">
            <div className="absolute top-1.5 left-1/2 w-1 h-1.5 bg-white rounded-sm -translate-x-1/2 animate-scroll" />
          </div>
          <div className="arrow w-3 h-3 border-r-1 border-b border-white rotate-45 animate-rotate" />
        </div>
      </div>
    </section>
  );
};

export default VideoHero;