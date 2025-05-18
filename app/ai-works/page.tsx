'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  date: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  titleUrl?: string;
}

export default function AIWorks() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add URL detection and conversion utility
  const convertUrlsToLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 underline transition-colors"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    fetchProjects();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/ai-works');
      const data = await response.json();
      setProjects(data.projects);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative bg-black overflow-y-auto">
      <style jsx global>{`
        body {
          overflow-y: auto !important;
        }
        
        .project-card {
          width: 100%;
          max-width: 1000px;
          margin: 2.5rem auto;
          transition: all 0.3s ease;
        }

        .project-content {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3.5rem;
          transform: translateZ(0);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1),
                     0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .project-content:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 2rem;
        }

        .tech-tag {
          background: rgba(34, 197, 94, 0.08);
          color: #4ade80;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
          border: 1px solid rgba(74, 222, 128, 0.15);
          transition: all 0.2s ease;
        }

        .tech-tag:hover {
          background: rgba(34, 197, 94, 0.12);
          border-color: rgba(74, 222, 128, 0.25);
          transform: translateY(-1px);
        }

        .media-preview {
          width: 100%;
          max-height: 250px;
          border-radius: 8px;
          overflow: hidden;
          margin: 1rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .media-preview img,
        .media-preview video {
          width: 100%;
          height: 250px;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.2);
        }

        .custom-cursor {
          width: 30px;
          height: 30px;
          background-color: var(--cursor-color);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          mix-blend-mode: difference;
          transition: transform 0.2s ease;
          z-index: 9999;
        }

        body {
          cursor: none;
        }

        .project-description a {
          word-break: break-all;
        }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm py-6">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="home-button text-white hover:text-green-400 transition-colors">
            Jae Lee
          </Link>
          
          <nav className="nav-container flex gap-6">
            <Link href="/about" className="nav-button text-white hover:text-green-400 transition-colors">
              About
            </Link>
            <Link href="/ai-works" className="nav-button text-white hover:text-green-400 transition-colors">
              AI Works
            </Link>
          </nav>
        </div>
      </div>

      <div 
        className="custom-cursor"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div 
        className="container mx-auto px-8" 
        style={{ marginTop: '145px' }}>
        <h1 className="text-8xl font-bold text-center mb-32 text-white">
          AI Works
        </h1>

        <div className="space-y-12 pb-20">
          {isLoading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            projects
              .sort((a, b) => {
                // Convert date strings to Date objects for comparison
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                // Sort in descending order (newest first)
                return dateB.getTime() - dateA.getTime();
              })
              .map((project) => (
                <div 
                  key={project.id}
                  className="project-card relative"
                >
                  <div className="project-content">
                    <span className="text-green-400 text-sm mb-4 block font-medium tracking-wider">{project.date}</span>
                    <h2 className="text-5xl font-medium mb-8 transition-colors text-white">
                      {project.titleUrl ? (
                        <a
                          href={project.titleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-green-400 transition-colors"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h2>
                    {project.mediaUrl && (
                      <div className="media-preview mb-8">
                        {project.mediaType === 'video' ? (
                          <video 
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/portfolio-media/${project.mediaUrl}`}
                            controls
                            className="w-full h-[250px] object-contain"
                          />
                        ) : (
                          <img src={project.mediaUrl} alt={project.title} />
                        )}
                      </div>
                    )}
                    <p className="text-gray-300 mb-10 text-xl leading-relaxed whitespace-pre-wrap project-description">
                      {convertUrlsToLinks(project.description)}
                    </p>
                    <div className="tech-tags">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="tech-tag"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </main>
  );
} 