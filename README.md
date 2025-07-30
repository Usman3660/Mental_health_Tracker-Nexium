MindTrack
Welcome to MindTrack, a web application designed to help users track their mental wellness through journaling and AI-powered insights. Built with Next.js, this app integrates Supabase for authentication and data storage, the Grok API for AI analysis, and optional MongoDB for additional data management. Deployed on Vercel, MindTrack offers a user-friendly dashboard, journal entry system, and insights page to support mental health tracking.
Table of Contents

Features
Prerequisites
Installation
Usage
Development
Deployment
Environment Variables
Project Structure
API Endpoints
Contributing
License
Contact

Features

User Authentication: Secure login via Supabase magic links.
Journaling: Write and save journal entries with mood scores.
AI Insights: Analyze entries using the Grok API for personalized insights.
Dashboard: View recent entries, navigation to journal and insights, and daily wellness tips.
Mood Trends: Placeholder for tracking mood patterns (to be expanded).
Responsive Design: Optimized for desktop and mobile using Tailwind CSS.

Prerequisites

Node.js: v18.x or later (recommended).
npm: v9.x or later (included with Node.js).
Git: For version control.
Vercel Account: For deployment (optional but recommended).
Supabase Account: For authentication and database setup.
Grok API Key: From xAI for AI analysis.
MongoDB (Optional): If using MongoDB integration.

Installation

Clone the Repository:
git clone https://github.com/your-username/mindtrack.git
cd mindtrack


Install Dependencies:
npm install


Set Up Environment Variables:

Create a .env.local file in the root directory.
Add the following variables with your credentials:NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_KEY=your-service-role-key
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
GROK_API_KEY=your-grok-api-key


Replace placeholders with actual values from your Supabase dashboard and xAI console.


Initialize Supabase:

Sign up at Supabase and create a new project.
Enable "Row Level Security" and create a journal_entries table with columns: id, user_id, content, created_at, mood_score.
Copy the URL and anon key from the Supabase dashboard settings.



Usage

Run Locally:
npm run dev


Open http://localhost:3000 in your browser.
Log in with a magic link, write journal entries, and view AI insights on the dashboard.


Key Pages:

/: Landing page.
/login: Login with magic link.
/dashboard: User dashboard with recent entries and navigation.
/journal: Write and submit journal entries.
/insights: View all AI-generated insights.
/auth/callback: Handles magic link authentication.


Functionality:

Enter a journal entry on the dashboard or journal page and click "Save and Analyze" to get AI insights.
Navigate to insights or trends via the dashboard cards.



Development
Scripts

npm run dev: Start the development server.
npm run build: Build the production version.
npm run start: Start the production server.

Code Style

Use Tailwind CSS for styling (configured in tailwind.config.js).
Follow JavaScript/ES6 standards with consistent indentation.

Adding Features

Extend pages/journal.js for mood score input.
Implement trends logic in pages/dashboard.js using Supabase queries.

Deployment

Prepare for Deployment:

Ensure .env.local variables are set up locally.
Add environment variables to Vercel (see below).


Deploy with Vercel:

Install the Vercel CLI:npm install -g vercel


From the mindtrack/ directory, run:vercel


Follow prompts, selecting the mindtrack/ directory as the root.
Set environment variables in the Vercel dashboard under "Settings" > "Environment Variables".


Vercel Configuration:

Ensure vercel.json is in the root:{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "SUPABASE_KEY": "@supabase_service_key",
    "MONGODB_URI": "@mongodb_connection_string",
    "GROK_API_KEY": "@grok_api_key"
  }
}


Add secrets in the Vercel dashboard with names matching the @ references (e.g., next_public_supabase_url).



Environment Variables



Variable
Description
Example Value



NEXT_PUBLIC_SUPABASE_URL
Supabase project URL
https://your-project.supabase.co


NEXT_PUBLIC_SUPABASE_ANON_KEY
Supabase anon key
Long JWT string from Supabase


SUPABASE_KEY
Supabase service role key
Long JWT string from Supabase


MONGODB_URI
MongoDB connection string (optional)
mongodb+srv://user:password@cluster...


GROK_API_KEY
Grok API key from xAI
gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



Add these to .env.local for local development and to Vercel secrets for deployment.

Project Structure
mindtrack/
│
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS config for Tailwind
├── tailwind.config.js          # Tailwind CSS config
├── vercel.json                 # Vercel deployment config
├── .env.local                  # Local environment variables (not committed)
│
├── lib/
│   ├── api.js                  # Server-side logic: Supabase, MongoDB, Groq API
│   └── supabase.js             # Client-side Supabase client setup
│
├── pages/
│   ├── _document.js            # Custom Next.js document (includes Tailwind CDN)
│   ├── index.js                # Landing page (home)
│   ├── login.js                # Login page (magic link)
│   ├── dashboard.js            # User dashboard
│   ├── journal.js              # Journal entry page
│   ├── insights.js             # All AI insights page
│   ├── api/
│   │   ├── journal.js          # API route for journal submission and analysis
│   │   └── login.js            # API route for login
│   └── auth/
│       └── callback.js         # Auth callback handler
│
├── public/
│   └── images/                 # App images
│       ├── logo.png
│       ├── logo.svg
│       ├── mind.png
│       └── mind.svg
│
└── ... (node_modules, etc.)

API Endpoints

POST /api/login: Handles magic link authentication.
POST /api/journal: Saves a journal entry and returns AI analysis.

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature-name".
Push to the branch: git push origin feature-name.
Open a Pull Request with a clear description.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact

Author: [Your Name]
Email: [your.email@example.com]
GitHub: github.com/your-username
