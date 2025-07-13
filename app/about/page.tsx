'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function About() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [x, setX] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    fetchContent();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      setContent(data.content);
      setLinkedin(data.linkedin || '');
      setX(data.x || '');
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Link href="/" className="home-button absolute top-8 left-8 text-white hover:text-green-400 transition-colors">
        Jae Lee
      </Link>
      
      <nav className="nav-container absolute top-8 right-8 flex gap-6">
        <Link href="/about" className="nav-button text-white hover:text-green-400 transition-colors">
          About
        </Link>
        <Link href="/ai-works" className="nav-button text-white hover:text-green-400 transition-colors">
          AI Works
        </Link>
      </nav>

      <div 
        className="custom-cursor"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="text-center z-10 w-full px-4 mx-auto" style={{ maxWidth: '90vw' }}>
        <div className="relative mb-16 flex items-center">
          <div className="mx-auto relative" style={{ width: '100%', maxWidth: '1000px' }}>
            <h1 className="text-4xl font-medium text-white text-left">About Me</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="text-lg leading-relaxed space-y-12 text-gray-300 mx-auto" style={{ maxWidth: '1000px' }}>
            <p className="text-left tracking-wide" style={{ lineHeight: '1.8' }}>
              {content}
            </p>
            {(linkedin || x) && (
              <div className="flex flex-col items-center mt-10 mb-2">
                <span className="mr-6 text-gray-200 text-lg font-medium whitespace-nowrap">Find me on:</span>
                <div className="flex flex-row items-center gap-[5px]">
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-[#e6f0fa] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0077b5] focus:ring-offset-2"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                    >
                      <svg width="32" height="32" viewBox="0 0 448 448" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="224" cy="224" r="224" fill="#0077B5"/>
                        <path d="M120 176h48v144h-48V176zm24-24c-15.5 0-28-12.5-28-28s12.5-28 28-28 28 12.5 28 28-12.5 28-28 28zm56 24h46v20.5h.7c6.4-12.1 22-24.9 45.3-24.9 48.5 0 57.5 31.9 57.5 73.4V320h-48v-68c0-16.2-.3-37-22.5-37-22.5 0-25.9 17.6-25.9 35.8V320h-48V176z" fill="white"/>
                      </svg>
                    </a>
                  )}
                  {x && (
                    <a
                      href={x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 flex items-center justify-center bg-black rounded-full shadow-lg border-4 border-white hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                      aria-label="X (Twitter)"
                      title="X (Twitter)"
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#000" stroke="white" strokeWidth="2"/>
                        <path d="M22.5 8.5H24.5L18.5 15.5L25.5 23.5H21L16 18L11.5 23.5H7.5L14.5 15.5L8 8.5H12.5L16 12.5L19.5 8.5ZM20.5 21.5H22L13.5 10.5H12L20.5 21.5Z" fill="white"/>
                      </svg>
                    </a>
                  )}
                  </div>
                </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 