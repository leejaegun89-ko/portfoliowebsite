import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateToCloudinary() {
  try {
    // Read the current data
    const dataPath = path.join(process.cwd(), 'app', 'data', 'ai-works.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Process each project
    for (const project of data.projects) {
      if (project.mediaUrl && project.mediaUrl.startsWith('/uploads/')) {
        const localPath = path.join(process.cwd(), 'public', project.mediaUrl);
        
        if (fs.existsSync(localPath)) {
          console.log(`Uploading ${project.mediaUrl}...`);
          
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(localPath, {
            resource_type: project.mediaType,
            folder: 'portfolio-media',
          });
          
          // Update the URL in the data
          project.mediaUrl = result.secure_url;
          console.log(`Uploaded successfully. New URL: ${result.secure_url}`);
        } else {
          console.log(`File not found: ${localPath}`);
        }
      }
    }
    
    // Save the updated data
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateToCloudinary(); 