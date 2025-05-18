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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST to create or update a project
export async function POST(request: Request) {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    const requestData = await request.json();

    if (requestData.action === 'create') {
      const newProject = {
        ...requestData.project,
        id: Date.now().toString()
      };
      data.projects.push(newProject);
    } else if (requestData.action === 'update') {
      const { id, ...updateData } = requestData.project;
      const projectIndex = data.projects.findIndex((p: any) => p.id === id);
      
      if (projectIndex === -1) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...updateData,
        id,
        technologies: updateData.technologies || [],
        date: updateData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
    } else if (requestData.action === 'delete') {
      const projectIndex = data.projects.findIndex((p: any) => p.id === requestData.project.id);
      
      if (projectIndex === -1) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      data.projects.splice(projectIndex, 1);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating projects:', error);
    return NextResponse.json(
      { error: 'Failed to update projects' },
      { status: 500 }
    );
  }
} 