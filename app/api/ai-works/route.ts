import { NextResponse } from 'next/server';

const projects = {
  "projects": [
    {
      "id": "1747516525263",
      "title": "Audio to Text, and Translate",
      "description": "How to use it:\n\n1) Click Record / Stop to start and stop your recording. Speak while recording\n2) Click Record / Stop again to end the recording\n3) Click Play / Stop to listen to your recording\n4) Click Play / Stop again to stop playback\n5) Click Save to save your recording\n6) Click Transcription to generate a transcript of your recording\n7) Enter the target language you want to translate to, then click Translate.",
      "technologies": [
        "Bubble (No Code SaaS)",
        "OpenAI API",
        "Text Generation and Prompting",
        "Audio Visualization API"
      ],
      "date": "August 2023",
      "mediaUrl": null,
      "mediaType": null,
      "titleUrl": "https://text-to-speech-42991.bubbleapps.io/version-test?debug_mode=true"
    },
    {
      "id": "1747516212117",
      "title": "AI Fitness Workout Planner",
      "description": "Built an AI Workout Plan Builder!🏋️‍♀️\n\n1. Select your workout intensity to match your vibe.\n2. Type which muscle(s) you are crushing on today.",
      "technologies": [
        "Bubble (No Code SaaS)",
        "OpenAI API",
        "Text Generation and Prompting"
      ],
      "date": "June 2023",
      "titleUrl": "https://workout-plan-by-jae-lee.bubbleapps.io/version-test?debug_mode=true",
      "mediaUrl": "AI_Fitness_Planner-1747525212197-823888478",
      "mediaType": "video"
    },
    {
      "id": "1",
      "title": "AI Image Generator",
      "description": "With ZERO development experience, I built an AI Chatbot & AI Image Generator using Bubble with OpenAI integration in just a day.",
      "technologies": [
        "Bubble (No Code SaaS)",
        "OpenAI API",
        "Image Generation"
      ],
      "date": "May 2023",
      "newTech": "",
      "titleUrl": "http://ai-image-by-jae-lee.bubbleapps.io/version-test/?debug_mode=true",
      "mediaUrl": null,
      "mediaType": null
    },
    {
      "id": "2",
      "title": "AI Chat Bot",
      "description": "With ZERO development experience, I built an AI Chatbot & AI Image Generator using Bubble with OpenAI integration in just a day.",
      "technologies": [
        "Bubble (No Code SaaS)",
        "OpenAI API",
        "Text Generation and Prompting"
      ],
      "date": "May 2023",
      "titleUrl": "https://chatapp-by-jae-lee.bubbleapps.io/version-test/?debug_mode=true",
      "mediaUrl": null,
      "mediaType": null
    },
    {
      "id": "1747526638707",
      "title": "AI Job Interview Practice Tool",
      "description": "How to use it:\n\n1. Type Company and Role\n2. Click each button to generate behavioral questions and technical / hypothetical questions to practice\n3. Click answer guide button to review",
      "technologies": [
        "Bubble (No Code SaaS)",
        "OpenAI API"
      ],
      "date": "July 2023",
      "titleUrl": "https://job-interview-buddy.bubbleapps.io/version-test?debug_mode=true",
      "mediaUrl": "Screen_Recording_2025-05-17_at_8.06.36_PM-1747526872890-998726735",
      "mediaType": "video"
    },
    {
      "id": "1747526968740",
      "title": "AI Cartoon Generator",
      "description": "Bubble + Zapier + Visualization",
      "technologies": [
        "Zapier",
        "Bubble (No Code SaaS)"
      ],
      "date": "August 2023",
      "mediaUrl": "Screen_Recording_2025-05-17_at_8.13.46_PM-1747527345900-621055327",
      "mediaType": "video",
      "titleUrl": ""
    }
  ]
};

export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
  try {
    return NextResponse.json(projects);
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
    const requestData = await request.json();
    return NextResponse.json(
      { error: 'Updates not supported in production' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating projects:', error);
    return NextResponse.json(
      { error: 'Failed to update projects' },
      { status: 500 }
    );
  }
} 