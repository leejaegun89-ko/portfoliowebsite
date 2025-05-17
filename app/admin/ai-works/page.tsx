'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  date: string;
  newTech?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export default function AdminAIWorks() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update projects with the new media URL
      const updatedProjects = [...projects];
      const projectIndex = selectedProjectIndex;
      
      if (projectIndex !== null && projectIndex >= 0) {
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          mediaUrl: data.url,
        };
        setProjects(updatedProjects);
        saveProjects(updatedProjects);
      }
      
      setUploadStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus('error');
    }
  };

  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      const response = await fetch('/api/ai-works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjects),
      });

      if (!response.ok) {
        throw new Error('Failed to save projects');
      }
    } catch (error) {
      console.error('Error saving projects:', error);
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
          gap: 16px;
          margin-top: 2rem;
        }

        .tech-tag {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          border: 1px solid rgba(74, 222, 128, 0.2);
          transition: all 0.2s ease;
          margin: 4px;
        }

        .tech-tag:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(74, 222, 128, 0.3);
          transform: translateY(-2px);
        }

        .edit-button {
          position: absolute;
          top: 1rem;
          right: 6rem;
          padding: 0.5rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.2);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .edit-button:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(74, 222, 128, 0.3);
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .edit-form input,
        .edit-form textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 16px;
        }

        .edit-form textarea {
          min-height: 120px;
          resize: vertical;
        }

        .tech-input {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tech-input input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 16px;
        }

        .tech-tags-editor {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .tech-tag-editor {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 14px;
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .delete-tag {
          background: none;
          border: none;
          color: #4ade80;
          cursor: pointer;
          padding: 0;
          font-size: 18px;
          line-height: 1;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .delete-tag:hover {
          opacity: 1;
        }

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

        .cancel-button {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          color: #e5e7eb;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .delete-project {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .delete-project:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .add-project {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.2);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s ease;
          margin-bottom: 2rem;
        }

        .add-project:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(74, 222, 128, 0.3);
          transform: translateY(-1px);
        }

        .add-project svg {
          width: 20px;
          height: 20px;
        }

        .publish-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .publish-button:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-1px);
        }

        .publish-button svg {
          width: 20px;
          height: 20px;
        }

        .media-upload {
          width: 100%;
          height: 120px;
          border: 2px dashed rgba(74, 222, 128, 0.3);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          margin: 1rem 0;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(0, 0, 0, 0.2);
        }

        .media-upload:hover {
          border-color: rgba(74, 222, 128, 0.5);
          background: rgba(74, 222, 128, 0.05);
        }

        .media-upload svg {
          width: 24px;
          height: 24px;
        }

        .media-upload span {
          font-size: 0.875rem;
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

        .remove-media {
          position: absolute;
          top: 1rem;
          right: 11rem;
          padding: 0.4rem 0.8rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .remove-media:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
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
              href="/ai-works" 
              className="publish-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              View Page
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

        <div className="text-center mb-20">
          <button
            onClick={async () => {
              const newProject = {
                id: Date.now().toString(),
                title: "New AI Project",
                description: "Developed a sophisticated AI system that helps solve complex problems. Built with advanced machine learning models and innovative algorithms to provide intelligent solutions.",
                technologies: ["AI", "Machine Learning", "Python"],
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
              };

              try {
                const response = await fetch('/api/ai-works', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    action: 'create',
                    project: newProject
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  setProjects(data.projects);
                } else {
                  throw new Error('Failed to create project');
                }
              } catch (error) {
                console.error('Error creating project:', error);
                alert('Failed to create project. Please try again.');
              }
            }}
            className="add-project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
        </div>

        <div className="space-y-12 pb-20">
          {isLoading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            projects.map((project, index) => (
              <div 
                key={project.id}
                className="project-card relative"
              >
                <div className="project-content">
                  {editingProject?.id === project.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editingProject.date}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          date: e.target.value
                        })}
                        placeholder="Date"
                        className="text-sm font-medium tracking-wider"
                      />
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          title: e.target.value
                        })}
                        placeholder="Title"
                        className="text-4xl font-medium"
                      />
                      <textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          description: e.target.value
                        })}
                        placeholder="Description"
                        className="text-xl"
                      />
                      
                      {editingProject.mediaUrl ? (
                        <div className="media-preview">
                          {editingProject.mediaType === 'video' ? (
                            <video src={editingProject.mediaUrl} controls />
                          ) : (
                            <img src={editingProject.mediaUrl} alt={editingProject.title} />
                          )}
                          <button
                            className="remove-media"
                            onClick={() => setEditingProject({
                              ...editingProject,
                              mediaUrl: undefined,
                              mediaType: undefined
                            })}
                          >
                            Remove Media
                          </button>
                        </div>
                      ) : (
                        <label className="media-upload">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              await handleFileUpload(file);
                            }}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-green-400">Upload image or video</span>
                          <span className="text-gray-500 text-xs">Supports images and videos</span>
                        </label>
                      )}

                      <div className="tech-input">
                        <input
                          type="text"
                          value={editingProject.newTech || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.endsWith(',')) {
                              const newTech = value.slice(0, -1).trim();
                              if (newTech && !editingProject.technologies.includes(newTech)) {
                                setEditingProject({
                                  ...editingProject,
                                  technologies: [...editingProject.technologies, newTech],
                                  newTech: ''
                                });
                              }
                            } else {
                              setEditingProject({
                                ...editingProject,
                                newTech: value
                              });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editingProject.newTech) {
                              e.preventDefault();
                              const newTech = editingProject.newTech.trim();
                              if (newTech && !editingProject.technologies.includes(newTech)) {
                                setEditingProject({
                                  ...editingProject,
                                  technologies: [...editingProject.technologies, newTech],
                                  newTech: ''
                                });
                              }
                            }
                          }}
                          placeholder="Add technologies (press Enter or comma to add)"
                        />
                        <div className="tech-tags-editor">
                          {editingProject.technologies.map((tech, index) => (
                            <div key={index} className="tech-tag-editor">
                              {tech}
                              <button
                                type="button"
                                className="delete-tag"
                                onClick={() => {
                                  setEditingProject({
                                    ...editingProject,
                                    technologies: editingProject.technologies.filter((_, i) => i !== index)
                                  });
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              const response = await fetch('/api/ai-works', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  action: editingProject.id ? 'update' : 'create',
                                  project: {
                                    ...editingProject,
                                    newTech: undefined
                                  }
                                }),
                              });

                              if (response.ok) {
                                const data = await response.json();
                                setProjects(data.projects);
                                setEditingProject(null);
                              } else {
                                throw new Error('Failed to save project');
                              }
                            } catch (error) {
                              console.error('Error saving project:', error);
                              alert('Failed to save project. Please try again.');
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                          className="save-button"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setEditingProject(null)}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingProject(project)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this project?')) {
                            try {
                              const response = await fetch('/api/ai-works', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  action: 'delete',
                                  project: { id: project.id }
                                }),
                              });

                              if (response.ok) {
                                const data = await response.json();
                                setProjects(data.projects);
                              } else {
                                throw new Error('Failed to delete project');
                              }
                            } catch (error) {
                              console.error('Error deleting project:', error);
                              alert('Failed to delete project. Please try again.');
                            }
                          }
                        }}
                        className="delete-project"
                      >
                        Delete
                      </button>
                      <span className="text-green-400 text-sm mb-4 block font-medium tracking-wider">{project.date}</span>
                      <h2 className="text-5xl font-medium mb-8 transition-colors text-white">{project.title}</h2>
                      {project.mediaUrl && (
                        <div className="media-preview mb-8">
                          {project.mediaType === 'video' ? (
                            <video src={project.mediaUrl} controls />
                          ) : (
                            <img src={project.mediaUrl} alt={project.title} />
                          )}
                        </div>
                      )}
                      <p className="text-gray-300 mb-10 text-xl leading-relaxed">{project.description}</p>
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
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 