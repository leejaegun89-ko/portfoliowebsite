import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'projects.json');

// Initialize data directory and file if they don't exist
async function initializeDataFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      await fs.access(DATA_FILE_PATH);
    } catch {
      // File doesn't exist, create it with initial data
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify({ projects: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

// Read projects from file
async function readProjects() {
  try {
    await initializeDataFile();
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return { projects: [] };
  }
}

// Write projects to file
async function writeProjects(projects: any) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error writing projects:', error);
    throw error;
  }
}

export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
  try {
    const projects = await readProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST to handle create, update, and delete operations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, project } = body;

    if (!action || !project) {
      return NextResponse.json(
        { error: 'Missing action or project data' },
        { status: 400 }
      );
    }

    const data = await readProjects();

    switch (action) {
      case 'create':
        // Add new project
        data.projects.push(project);
        break;

      case 'update':
        // Update existing project
        const updateIndex = data.projects.findIndex((p: any) => p.id === project.id);
        if (updateIndex === -1) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: 404 }
          );
        }
        data.projects[updateIndex] = project;
        break;

      case 'delete':
        // Delete project
        const deleteIndex = data.projects.findIndex((p: any) => p.id === project.id);
        if (deleteIndex === -1) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: 404 }
          );
        }
        data.projects.splice(deleteIndex, 1);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await writeProjects(data);

    return NextResponse.json({
      message: `Project ${action}d successfully`,
      projects: data.projects
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 