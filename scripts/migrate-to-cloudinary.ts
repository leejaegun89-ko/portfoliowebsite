import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '../lib/cloudinary';

async function migrateToCloudinary() {
  try {
    // Read the current ai-works.json
    const aiWorksPath = path.join(process.cwd(), 'app', 'data', 'ai-works.json');
    const aiWorksData = JSON.parse(fs.readFileSync(aiWorksPath, 'utf-8'));

    // Process each project
    for (const project of aiWorksData.projects) {
      if (project.mediaUrl && project.mediaUrl.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', project.mediaUrl);
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
          console.log(`Migrating file: ${project.mediaUrl}`);
          
          // Read the file
          const fileBuffer = fs.readFileSync(filePath);
          
          // Upload to Cloudinary
          const result = await uploadToCloudinary(fileBuffer, project.mediaType as 'video' | 'image');
          
          // Update the URL in the project
          project.mediaUrl = result.secure_url;
          
          console.log(`Migrated ${project.title} media to: ${result.secure_url}`);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }
    }

    // Save the updated data back to ai-works.json
    fs.writeFileSync(aiWorksPath, JSON.stringify(aiWorksData, null, 2));
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateToCloudinary(); 