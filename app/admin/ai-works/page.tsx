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
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video' | null;
  titleUrl?: string;
}

export default function AdminAIWorks() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('idle');
      
      // Get current project index from editing project
      const currentProjectIndex = projects.findIndex(p => p.id === editingProject?.id);
      console.log('Uploading for project:', {
        index: currentProjectIndex,
        projectId: editingProject?.id,
        fileName: file.name
      });

      if (currentProjectIndex === -1 || !editingProject) {
        throw new Error('No project selected for upload');
      }

      // Show loading message
      const loadingMessage = file.type.startsWith('video/') 
        ? 'Uploading and processing video... This may take a few minutes.'
        : 'Uploading file...';
      alert(loadingMessage);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      const data = await response.json();
      console.log('Upload response data:', data);

      if (!response.ok) {
        console.error('Upload error:', data);
        throw new Error(data.error || 'Upload failed');
      }

      console.log('Updating project with new media:', {
        url: data.url,
        mediaType: data.mediaType,
        projectIndex: currentProjectIndex
      });

      // Update editing project first
      const updatedProject = {
        ...editingProject,
        mediaUrl: data.url,
        mediaType: data.mediaType
      };
      
      // Save to backend
      console.log('Saving updated project to backend');
      await saveProjects([updatedProject]);
      
      // Update local state
      setEditingProject(updatedProject);
      alert('File uploaded and saved successfully!');
      
      setUploadStatus('success');
          } catch (error) {
        console.error('Upload error:', error);
        setUploadStatus('error');
        
        let errorMessage = '파일 업로드에 실패했습니다.';
        if (error instanceof Error) {
          errorMessage += ' 오류: ' + error.message;
        }
        
        alert(errorMessage);
        
        // Reset editing state on error
        const originalProject = projects.find(p => p.id === editingProject?.id);
        if (originalProject) {
          setEditingProject(originalProject);
        }
      }
  };

  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      const response = await fetch('/api/ai-works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          project: updatedProjects[0] // 현재는 한 번에 하나의 프로젝트만 업데이트
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save projects');
      }

      const data = await response.json();
      setProjects(data.projects); // 서버에서 반환된 최신 프로젝트 목록으로 상태 업데이트
    } catch (error) {
      console.error('Error saving projects:', error);
      throw error; // 에러를 상위로 전파하여 적절한 처리가 가능하도록 함
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
          min-height: 200px;
          resize: vertical;
          white-space: pre-wrap;
          line-height: 1.6;
          padding: 1rem;
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
          gap: 8px;
          margin-top: 0.5rem;
        }

        .tech-tag-editor {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.08);
          color: #4ade80;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          letter-spacing: -0.01em;
          border: 1px solid rgba(74, 222, 128, 0.15);
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
          position: relative;
        }

        .media-preview img,
        .media-preview video {
          width: 100%;
          height: 250px;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.2);
        }

        .project-description a {
          word-break: break-all;
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
        <div className="flex justify-between items-center mb-32">
          <h1 className="text-8xl font-bold text-white">
            AI Works
          </h1>
          <button
            onClick={async () => {
              const newProject = {
                id: Date.now().toString(),
                title: "새 프로젝트 제목",
                description: "프로젝트 설명을 여기에 작성하세요.",
                technologies: ["기술 1", "기술 2"],
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                mediaUrl: null,
                mediaType: null,
                titleUrl: ""
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

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || 'Failed to create project');
                }

                const data = await response.json();
                setProjects(data.projects);
                setEditingProject(newProject); // 생성 후 바로 편집 모드로 전환
              } catch (error) {
                console.error('Error creating project:', error);
                alert('새 프로젝트 생성에 실패했습니다. 다시 시도해주세요.');
              }
            }}
            className="add-project text-xl py-4 px-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
        </div>

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
              .map((project, index) => (
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
                      <input
                        type="text"
                        value={editingProject.titleUrl || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          titleUrl: e.target.value
                        })}
                        placeholder="Title URL (optional)"
                        className="text-xl"
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
                        <div className="relative bg-black/20 border-2 border-gray-800 rounded-xl p-4 my-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="bg-black rounded-lg overflow-hidden">
                              {editingProject.mediaType === 'video' ? (
                                <video 
                                  src={editingProject.mediaUrl}
                                  controls 
                                  className="w-full h-[250px] object-contain"
                                />
                              ) : (
                                <img 
                                  src={editingProject.mediaUrl}
                                  alt={editingProject.title} 
                                  className="w-full h-[250px] object-contain"
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('이 미디어를 삭제하시겠습니까?')) {
                                  setEditingProject({
                                    ...editingProject,
                                    mediaUrl: undefined,
                                    mediaType: undefined
                                  });
                                }
                              }}
                              className="flex items-center gap-2 ml-4 px-3 py-2 bg-black/30 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 text-gray-400 hover:text-red-400 rounded-lg transition-all duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              삭제
                            </button>
                          </div>
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

                              // Check file type and size
                              const isVideo = file.type.startsWith('video/');
                              const isImage = file.type.startsWith('image/');
                              
                              if (!isVideo && !isImage) {
                                alert('이미지나 비디오 파일만 업로드 가능합니다.');
                                return;
                              }

                              const maxSize = 100 * 1024 * 1024; // 100MB
                              if (file.size > maxSize) {
                                alert('파일 크기는 100MB 이하여야 합니다.');
                                return;
                              }

                              try {
                                await handleFileUpload(file);
                              } catch (error) {
                                console.error('Upload error:', error);
                                alert('파일 업로드에 실패했습니다.');
                              }
                            }}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-green-400">이미지/비디오 업로드</span>
                          <span className="text-gray-500 text-xs">최대 100MB</span>
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
                              // Create a copy of the project without newTech
                              const projectToSave = {
                                ...editingProject,
                                newTech: undefined,
                                // Make sure we're explicitly handling media fields
                                mediaUrl: editingProject.mediaUrl || null,
                                mediaType: editingProject.mediaType || null
                              };

                              console.log('Saving project:', projectToSave);

                              const response = await fetch('/api/ai-works', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  action: 'update',
                                  project: projectToSave
                                }),
                              });

                              if (!response.ok) {
                                throw new Error('Failed to save project');
                              }

                              const data = await response.json();
                              console.log('Save response:', data);
                              
                              // Update both the projects list and clear editing state
                              setProjects(data.projects);
                              setEditingProject(null);
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
                          if (window.confirm('이 프로젝트를 삭제하시겠습니까?')) {
                            try {
                              const response = await fetch('/api/ai-works', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  action: 'delete',
                                  project: project
                                }),
                              });

                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Failed to delete project');
                              }

                              const data = await response.json();
                              setProjects(data.projects);
                            } catch (error) {
                              console.error('Error deleting project:', error);
                              alert('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
                            }
                          }
                        }}
                        className="delete-project"
                      >
                        Delete
                      </button>
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
                        <div className="relative bg-black/20 border-2 border-gray-800 rounded-xl p-4 mb-8">
                          <div className="bg-black rounded-lg overflow-hidden">
                            {project.mediaType === 'video' ? (
                              <video 
                                src={project.mediaUrl}
                                controls 
                                className="w-full h-[250px] object-contain"
                              />
                            ) : (
                              <img 
                                src={project.mediaUrl}
                                alt={project.title} 
                                className="w-full h-[250px] object-contain"
                              />
                            )}
                          </div>
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