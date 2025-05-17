'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminAbout() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        alert('Content saved successfully!');
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <style jsx global>{`
        .save-button {
          padding: 0.75rem 1.5rem;
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .save-button:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.3);
          border-color: rgba(74, 222, 128, 0.4);
          transform: translateY(-1px);
        }

        .save-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .content-editor {
          width: 100%;
          min-height: 300px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          line-height: 1.8;
          resize: vertical;
          margin-bottom: 1rem;
        }

        .content-editor:focus {
          outline: none;
          border-color: rgba(74, 222, 128, 0.3);
          box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1);
        }
      `}</style>

      <Link href="/admin" className="home-button absolute top-8 left-8 text-white hover:text-green-400 transition-colors">
        Admin Dashboard
      </Link>
      
      <nav className="nav-container absolute top-8 right-8 flex gap-6">
        <Link href="/admin/about" className="nav-button text-white hover:text-green-400 transition-colors">
          About
        </Link>
        <Link href="/admin/ai-works" className="nav-button text-white hover:text-green-400 transition-colors">
          AI Works
        </Link>
        <Link 
          href="/" 
          className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
        >
          View Site
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
            <h1 className="text-4xl font-medium text-white text-left">Edit About Page</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="space-y-4 mx-auto" style={{ maxWidth: '1000px' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="content-editor"
              placeholder="Enter your about content here..."
            />
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="save-button"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 