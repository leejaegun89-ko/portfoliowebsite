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
          max-width: 700px;
          margin: 2.5rem auto;
          transition: box-shadow 0.3s;
          border-radius: 20px;
          box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);
          background: linear-gradient(135deg, rgba(30,41,59,0.95) 60%, rgba(16,185,129,0.07) 100%);
          border: 1.5px solid rgba(255,255,255,0.08);
        }
        .project-content {
          padding: 2.5rem 2rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .project-date {
          color: #67e8f9;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }
        .project-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .project-title a {
          color: #38bdf8;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .project-title a:hover {
          color: #34d399;
          text-decoration: underline;
        }
        .media-preview {
          width: 100%;
          max-height: 320px;
          border-radius: 14px;
          overflow: hidden;
          margin: 0.5rem 0 1.2rem 0;
          border: 1.5px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.18);
          box-shadow: 0 2px 16px 0 rgba(16,185,129,0.08);
        }
        .media-preview img,
        .media-preview video {
          width: 100%;
          height: 320px;
          object-fit: contain;
          background: #18181b;
        }
        .project-description {
          color: #e5e7eb;
          font-size: 1.13rem;
          line-height: 1.8;
          margin-bottom: 0.5rem;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .project-description a {
          color: #38bdf8;
          word-break: break-all;
        }
        .project-description a:hover {
          color: #34d399;
          text-decoration: underline;
        }
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .tech-tag {
          background: rgba(16,185,129,0.13);
          color: #34d399;
          padding: 0.45em 1.1em;
          border-radius: 999px;
          font-size: 0.98rem;
          font-weight: 500;
          border: 1px solid rgba(52,211,153,0.18);
          transition: background 0.2s, color 0.2s, border 0.2s;
        }
        .tech-tag:hover {
          background: rgba(16,185,129,0.22);
          color: #67e8f9;
          border: 1px solid #67e8f9;
        }
        @media (max-width: 600px) {
          .project-card {
            max-width: 98vw;
            margin: 1.2rem auto;
          }
          .project-content {
            padding: 1.2rem 0.7rem 1.2rem 0.7rem;
          }
          .media-preview img,
          .media-preview video {
            height: 180px;
          }
          .project-title {
            font-size: 1.3rem;
          }
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
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
              })
              .map((project) => (
                <div 
                  key={project.id}
                  className="project-card"
                >
                  <div className="project-content">
                    <span className="project-date">{project.date}</span>
                    <div className="project-title">
                      {project.titleUrl ? (
                        <a
                          href={project.titleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title}
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-4 7h7a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z"/></svg>
                        </a>
                      ) : (
                        project.title
                      )}
                    </div>
                    {project.mediaUrl && (
                      <div className="media-preview">
                        {project.mediaType === 'video' ? (
                          <video
                            src={project.mediaUrl}
                            controls
                            className="w-full h-full object-contain"
                            playsInline
                          />
                        ) : (
                          <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-contain" />
                        )}
                      </div>
                    )}
                    <div className="project-description">
                      {convertUrlsToLinks(project.description)}
                    </div>
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