'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function About() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState('');
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
          </div>
        )}
      </div>
    </main>
  );
} 