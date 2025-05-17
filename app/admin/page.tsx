'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function AdminHome() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [typingText, setTypingText] = useState('');
  const [activeText, setActiveText] = useState(-1);
  const lastMoveTime = useRef<number>(0);
  const positions = useRef<{ x: number, y: number }[]>([]);
  
  const typingPart = "I'm Jae Lee — a Product Manager";
  const staticPart = "exploring the exciting world of AI";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const newPosition = { x: e.clientX, y: e.clientY };
      setCursorPosition(newPosition);
      
      if (currentTime - lastMoveTime.current > 400) {
        setActiveText(prev => (prev + 1) % 3);
        lastMoveTime.current = currentTime;
      }

      positions.current = positions.current.map((pos, idx) => {
        const targetOffset = floatingTexts[idx].offset;
        const targetX = newPosition.x + targetOffset.x;
        const targetY = newPosition.y + targetOffset.y;
        
        return {
          x: pos.x + (targetX - pos.x) * 0.05,
          y: pos.y + (targetY - pos.y) * 0.05
        };
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    positions.current = floatingTexts.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));
    
    const updatePositions = () => {
      if (positions.current.length > 0) {
        setPositionsState([...positions.current]);
        requestAnimationFrame(updatePositions);
      }
    };
    
    requestAnimationFrame(updatePositions);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let currentIndex = 0;
    let isDeleting = false;

    const typeText = () => {
      if (!isMounted) return;

      if (isDeleting) {
        if (currentIndex > 0) {
          currentIndex--;
          setTypingText(typingPart.slice(0, currentIndex));
          setTimeout(typeText, 30);
        } else {
          isDeleting = false;
          setTimeout(typeText, 500);
        }
      } else {
        if (currentIndex < typingPart.length) {
          currentIndex++;
          setTypingText(typingPart.slice(0, currentIndex));
          setTimeout(typeText, Math.random() * 50 + 50);
        } else {
          isDeleting = true;
          setTimeout(typeText, 1000);
        }
      }
    };

    typeText();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeText !== -1) {
      const timer = setTimeout(() => {
        setActiveText(-1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeText]);

  const [positionsState, setPositionsState] = useState<{ x: number, y: number }[]>([]);

  const floatingTexts = [
    { text: 'JUST', offset: { x: -250, y: -200 } },
    { text: 'DO', offset: { x: 250, y: 0 } },
    { text: 'IT', offset: { x: -250, y: 200 } },
  ];

  return (
    <>
      <style jsx global>{`
        body {
          overflow: hidden;
        }

        .publish-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: rgba(0, 122, 255, 0.1);
          border: 1px solid rgba(0, 122, 255, 0.2);
          border-radius: 1rem;
          color: #007AFF;
          font-size: 1.125rem;
          transition: all 0.2s ease;
        }

        .publish-button:hover {
          background: rgba(0, 122, 255, 0.15);
          border-color: rgba(0, 122, 255, 0.3);
        }

        .publish-button svg {
          width: 1.25rem;
          height: 1.25rem;
        }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm py-6">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <Link href="/admin" className="home-button text-white hover:text-green-400 transition-colors">
            Jae Lee
          </Link>
          
          <nav className="nav-container flex gap-6 items-center">
            <Link href="/admin/about" className="nav-button text-white hover:text-green-400 transition-colors">
              About
            </Link>
            <Link href="/admin/ai-works" className="nav-button text-white hover:text-green-400 transition-colors">
              AI Works
            </Link>
            <div className="w-px h-6 bg-white bg-opacity-20 mx-2"></div>
            <Link 
              href="/" 
              className="publish-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              View Site
            </Link>
          </nav>
        </div>
      </div>

      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="custom-cursor"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {floatingTexts.map((item, index) => (
          <div
            key={item.text}
            className={`floating-text ${index === activeText ? 'visible' : 'fade-out'}`}
            style={{
              left: positionsState[index]?.x || cursorPosition.x,
              top: positionsState[index]?.y || cursorPosition.y,
            }}
          >
            {item.text}
          </div>
        ))}

        <div className="text-center z-10 max-w-4xl px-4">
          <h1 className="text-3xl font-medium whitespace-nowrap">
            Hi, <span className="typing-text">{typingText}</span> <span className="text-white">{staticPart}</span>
          </h1>
        </div>
      </main>

      <div style={{ position: 'fixed', right: '16px', bottom: '16px', zIndex: 50 }}>
        <div className="nav-button" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '14px' }}>
          Made with Vibe Coding ✨
        </div>
      </div>
    </>
  );
} 