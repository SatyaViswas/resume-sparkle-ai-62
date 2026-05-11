# ResuMate - AI-Powered Career Intelligence Platform

<div align="center">

![ResuMate](https://img.shields.io/badge/ResuMate-AI%20Career%20Platform-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Transform your career journey with AI-powered resume analysis, intelligent career path recommendations, and expert interview preparation**

[Live Demo](#) • [Documentation](#documentation) • [Contributing](#contributing) • [License](#license)

</div>

---

## 🚀 Overview

**ResuMate** is a comprehensive AI-powered platform designed to revolutionize career development. Whether you're a fresh graduate, career switcher, or seasoned professional, ResuMate provides intelligent tools to optimize your resume, discover career opportunities, ace interviews, and match with relevant job positions.

### Key Capabilities
- 🎯 **AI-Powered Resume Analysis** - Get intelligent feedback with ATS optimization insights
- 🏗️ **Smart Resume Builder** - Create professional resumes with multiple templates and instant export
- 🎨 **Career Path Discovery** - Explore new opportunities aligned with your skill set
- 💬 **Interview Preparation** - Practice with AI-generated technical and behavioral questions
- 💼 **Job Intelligence** - Discover roles that match your profile and aspirations
- 📊 **Career History** - Track your resume analyses and progress over time
- 🔐 **Secure Authentication** - Safe account management with email verification

---

## ✨ Features

### Resume Analyzer
- **Instant File Support** - Upload PDF, DOCX, or image formats
- **Comprehensive Analysis** - Get detailed feedback on structure, content, and ATS compatibility
- **Skill Extraction** - Automatic keyword and skill identification
- **Career Insights** - Discover recommended career paths based on your profile
- **Real-time Processing** - See progress with visual indicators

### Resume Builder
- **Multiple Templates** - Professional, Fresher, and Career Switcher designs
- **Rich Input Fields** - Customize every aspect including experience, education, skills, and certifications
- **Live Preview** - See changes instantly with the modern design system
- **Multi-Format Export** - Download as PDF or DOCX with perfect formatting

### Interview Preparation
- **AI-Generated Questions** - Get personalized interview questions relevant to your role
- **Realistic Practice** - Practice with questions matching job descriptions and skill levels
- **Comprehensive Prep** - Technical, behavioral, and situational questions

### Job Matching & Discovery
- **Intelligent Recommendations** - Find roles aligned with your resume and preferences
- **Career Path Suggestions** - Explore new positions in related fields
- **Job Alerts** - Stay updated with opportunities matching your profile

### Secure User Dashboard
- **Progress Tracking** - View your analysis history and improvements
- **Account Management** - Manage your profile and preferences securely
- **Data Privacy** - Your information is encrypted and secure

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with concurrent features
- **TypeScript** - Type-safe development with full intellisense
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality, unstyled component library
- **React Router 6** - Modern client-side routing
- **React Hook Form** - Efficient form state management
- **React Query (TanStack Query)** - Powerful data fetching and caching

### Backend & Services
- **Supabase** - Open-source Firebase alternative with:
  - PostgreSQL database
  - Real-time authentication
  - Edge Functions (serverless)
  - File storage
- **Cohere API** - Advanced NLP for resume analysis and text generation
- **Azure Computer Vision** - OCR and image processing for resume extraction
- **RapidAPI** - Job search and labor market data

### Document Processing
- **jsPDF** - PDF generation and manipulation
- **docx** - DOCX file creation
- **html2canvas** - HTML to image conversion for PDF export

### Development Tools
- **ESLint** - Code quality and style enforcement
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS transformations and automation
- **Autoprefixer** - Automatic browser prefix management

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9+ or **yarn** or **bun** package manager
- **Git** for version control
- **Supabase Account** ([Create Free](https://supabase.com)) for backend services
- **API Keys** for external services (see Configuration)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd resume-sparkle-ai-62
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id

# These are configured via Supabase dashboard (not needed client-side)
# SUPABASE_URL - For edge functions
# SUPABASE_SERVICE_ROLE_KEY - For privileged operations
# COHERE_API_KEY - For resume analysis (set in Supabase secrets)
# AZURE_COMPUTER_VISION_ENDPOINT - For OCR (set in Supabase secrets)
# AZURE_COMPUTER_VISION_KEY - For OCR (set in Supabase secrets)
# RAPIDAPI_KEY - For job search (set in Supabase secrets)
```

### 4. Set Up Supabase Local Development (Optional)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Start local Supabase instance
supabase start

# Link to your project (if using cloud)
supabase link --project-ref your_project_ref
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

---

## 🔧 Configuration

### Supabase Setup

#### Step 1: Create a Supabase Project
1. Visit [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in project details and create

#### Step 2: Set Up Environment Secrets
Configure your API keys in Supabase:

```bash
supabase secrets set COHERE_API_KEY="your_cohere_api_key"
supabase secrets set AZURE_COMPUTER_VISION_ENDPOINT="your_azure_endpoint"
supabase secrets set AZURE_COMPUTER_VISION_KEY="your_azure_key"
supabase secrets set RAPIDAPI_KEY="your_rapidapi_key"
```

#### Step 3: Deploy Edge Functions

```bash
supabase functions deploy analyze-resume
supabase functions deploy generate-interview-questions
supabase functions deploy search-jobs
```

### API Keys Configuration

#### Cohere API
1. Visit [Cohere Dashboard](https://dashboard.cohere.ai/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create or copy your API key
5. Run: `supabase secrets set COHERE_API_KEY="your_key"`

#### Azure Computer Vision
1. Create an Azure account at [azure.microsoft.com](https://azure.microsoft.com/)
2. Create a Computer Vision resource
3. Copy your endpoint and key
4. Set secrets:
   ```bash
   supabase secrets set AZURE_COMPUTER_VISION_ENDPOINT="your_endpoint"
   supabase secrets set AZURE_COMPUTER_VISION_KEY="your_key"
   ```

#### RapidAPI (Job Search)
1. Visit [RapidAPI](https://rapidapi.com/)
2. Find the job search API
3. Subscribe and get your API key
4. Run: `supabase secrets set RAPIDAPI_KEY="your_key"`

---

## 📁 Project Structure

```
resume-sparkle-ai-62/
├── src/
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── resume-templates/            # Resume design templates
│   │   │   ├── FresherTemplate.tsx
│   │   │   ├── ProfessionalTemplate.tsx
│   │   │   └── CareerSwitcherTemplate.tsx
│   │   ├── ActionCard.tsx
│   │   ├── AppHeader.tsx
│   │   ├── MetricCard.tsx
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Welcome.tsx                  # Landing page
│   │   ├── Auth.tsx                     # Authentication page
│   │   ├── Dashboard.tsx                # User dashboard
│   │   ├── ResumeReviewer.tsx           # Resume analysis page
│   │   ├── ResumeBuilder.tsx            # Resume builder page
│   │   ├── Interviewer.tsx              # Interview prep page
│   │   ├── Jobs.tsx                     # Job matching page
│   │   ├── History.tsx                  # Analysis history
│   │   └── NotFound.tsx                 # 404 page
│   ├── hooks/
│   │   ├── useAuth.tsx                  # Authentication hook
│   │   ├── use-toast.ts                 # Toast notifications
│   │   └── use-mobile.tsx               # Mobile detection
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                # Supabase client config
│   │       └── types.ts                 # TypeScript types
│   ├── lib/
│   │   └── utils.ts                     # Utility functions
│   ├── App.tsx                          # Main app component
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Global styles
│   └── vite-env.d.ts                    # Vite type declarations
├── supabase/
│   ├── config.toml                      # Supabase configuration
│   ├── functions/
│   │   ├── analyze-resume/              # Resume analysis edge function
│   │   ├── generate-interview-questions/# Interview questions function
│   │   └── search-jobs/                 # Job search function
│   └── migrations/                      # Database migrations
├── public/
│   └── robots.txt
├── index.html                           # HTML entry point
├── vite.config.ts                       # Vite configuration
├── tailwind.config.ts                   # Tailwind CSS config
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Project dependencies
└── README.md                            # This file
```

---

## 🎯 Usage Guide

### Creating Your First Resume Analysis

1. **Navigate to Resume Reviewer**
   - Click the "Resume Reviewer" button on the dashboard
   - Or navigate directly to `/analyze`

2. **Upload Your Resume**
   - Click the upload area or drag & drop
   - Supported formats: PDF, DOCX, PNG, JPG
   - Wait for processing to complete

3. **Review Analysis Results**
   - Get comprehensive feedback on your resume
   - View extracted skills and keywords
   - Explore recommended career paths
   - Check matching job opportunities

### Building a New Resume

1. **Go to Resume Builder**
   - From dashboard, click "Resume Builder"
   - Or navigate to `/builder`

2. **Fill Your Information**
   - Complete all sections with your details
   - Information is saved in real-time
   - Use rich text for better formatting

3. **Choose a Template**
   - Select from available designs
   - Live preview shows your resume format

4. **Export Your Resume**
   - Download as PDF for most compatibility
   - Or export as DOCX for further editing
   - Share directly with employers

### Interview Preparation

1. **Start Interview Practice**
   - Navigate to `/interviewer`
   - AI generates personalized questions
   - Based on your role and experience level

2. **Practice & Review**
   - Answer each question
   - Get real-time feedback
   - Track improvements over time

---

## 🔐 Security & Privacy

- **Data Encryption** - All data transmitted over HTTPS with TLS encryption
- **Secure Authentication** - Email-based authentication with verification
- **Privacy First** - Your resume data is never shared or used for training
- **Local Storage** - Sensitive data stored securely in browser storage
- **API Security** - All backend APIs secured with authentication tokens
- **GDPR Compliant** - Full data deletion and privacy controls available

---

## 📊 API Documentation

### Edge Functions

#### analyze-resume
Analyzes an uploaded resume using AI and Computer Vision

**Request:**
```javascript
const { data, error } = await supabase.functions.invoke('analyze-resume', {
  body: formData // FormData with 'file' field
});
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "ats_score": 85,
    "keywords": ["React", "TypeScript", "Node.js"],
    "recommendations": ["Add metrics to achievements"],
    "score_breakdown": {...}
  },
  "jobs": [{...}],
  "extracted_text": "..."
}
```

#### generate-interview-questions
Generates personalized interview questions

**Request:**
```javascript
const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
  body: { 
    resume_text: string,
    role: string,
    experience_level: string
  }
});
```

**Response:**
```json
{
  "questions": [
    {
      "question": "Tell us about...",
      "category": "behavioral",
      "difficulty": "medium"
    }
  ]
}
```

#### search-jobs
Searches for relevant job opportunities

**Request:**
```javascript
const { data, error } = await supabase.functions.invoke('search-jobs', {
  body: { 
    skills: string[],
    location: string,
    job_title: string
  }
});
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com/)
   - Import your repository
   - Add environment variables from your `.env` file

3. **Deploy**
   ```bash
   vercel
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Visit [netlify.com](https://netlify.com/)
   - Create new site from Git
   - Add environment variables
   - Deploy automatically

### Deploy to Self-Hosted Server

```bash
# Build for production
npm run build

# The 'dist' folder contains the production build
# Serve it with your preferred web server (nginx, Apache, etc.)

# Example with Node.js and serve:
npx serve dist
```

---

## 📦 Build & Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build locally
npm run preview

# Lint code for quality issues
npm run lint

# Format code (if configured)
npm run format
```

---

## 🐛 Troubleshooting

### Resume Analysis Not Showing Results

**Issue:** Resume analysis completes but shows no feedback

**Solution:**
1. Verify Cohere API key is valid and not expired
2. Check Supabase secrets: `supabase secrets list`
3. Update key if needed: `supabase secrets set COHERE_API_KEY="new_key"`
4. Redeploy function: `supabase functions deploy analyze-resume`
5. Check function logs: `supabase functions logs analyze-resume`

See [UPDATE_COHERE_API_KEY.md](./UPDATE_COHERE_API_KEY.md) for detailed steps.

### Upload File Format Errors

**Issue:** File upload fails with format error

**Solution:**
- Ensure file is under 10MB
- Use supported formats: PDF, DOCX, PNG, JPG
- Try converting file to PDF if issues persist

### Authentication Issues

**Issue:** Can't sign up or log in

**Solution:**
1. Check email for verification link
2. Verify Supabase auth is configured correctly
3. Clear browser cookies and cache
4. Try incognito/private browsing mode

### Build Fails

**Issue:** `npm run build` exits with errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install

# Try building again
npm run build

# Check for TypeScript errors
npm run lint
```

### Local Development Port Already in Use

**Issue:** Port 8080 is already in use

**Solution:**
```bash
# Use a different port
npm run dev -- --port 3000

# Or kill the process using port 8080
# On macOS/Linux:
lsof -ti:8080 | xargs kill -9

# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/resumate.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, commented code
   - Follow TypeScript best practices
   - Keep commits atomic and descriptive

4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

5. **Submit a Pull Request**
   - Provide clear description of changes
   - Link any related issues
   - Request review from maintainers

### Code Style Guidelines

- Use TypeScript for type safety
- Follow Prettier formatting (if configured)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and single-purpose

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful and accessible component library
- **Supabase** - Open-source backend platform
- **Cohere** - Advanced AI and NLP capabilities
- **Tailwind CSS** - Utility-first CSS framework
- **React Community** - For the amazing ecosystem

---

## 📞 Support & Contact

- **Documentation:** [Full Docs](#)
- **Issue Tracker:** [GitHub Issues](#)
- **Email:** support@resumate.dev
- **Twitter:** [@ResuMate](#)
- **Discord:** [Join Community](#)

---

## 🗺️ Roadmap

- [ ] Advanced resume analytics and insights
- [ ] Team/organization features
- [ ] Mobile native apps (iOS/Android)
- [ ] Real-time collaboration on resumes
- [ ] Integration with LinkedIn and other platforms
- [ ] Video interview practice
- [ ] Salary insights and negotiation tools
- [ ] Cover letter generation
- [ ] ATS database of top companies

---

## ⭐ Show Your Support

If you found ResuMate helpful, please:
- Star this repository ⭐
- Share with others in your network
- Report issues and suggest improvements
- Contribute to making it better

---

<div align="center">

**Made with ❤️ by the ResuMate Team**

**Last Updated:** May 2026

</div>
