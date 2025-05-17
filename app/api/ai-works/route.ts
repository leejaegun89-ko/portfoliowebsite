import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/ai-works.json');

export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading projects:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch projects' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// POST to create or update a project
export async function POST(request: Request) {
  try {
    const { action, project } = await request.json();
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (action === 'create') {
      // Create new project with unique ID
      const newProject = {
        ...project,
        id: Date.now().toString(), // Simple way to generate unique ID
        technologies: project.technologies || []
      };
      data.projects.unshift(newProject); // Add to the beginning of the array
    } 
    else if (action === 'update') {
      // Update existing project
      const projectIndex = data.projects.findIndex((p: any) => p.id === project.id);
      if (projectIndex === -1) {
        return new NextResponse(
          JSON.stringify({ error: 'Project not found' }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...project,
        technologies: project.technologies.filter((tech: string) => tech.trim() !== '')
      };
    }
    else if (action === 'delete') {
      // Delete project
      data.projects = data.projects.filter((p: any) => p.id !== project.id);
    }

    // Write updated data back to file
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error managing project:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to manage project' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 