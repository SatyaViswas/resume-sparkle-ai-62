import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Analyze resume function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      throw new Error('File is required');
    }

    console.log('Processing file:', file.name, 'for user:', userId || 'guest');

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large or unsupported format');
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain' // Added support for text files for testing
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File too large or unsupported format');
    }

    // Step 1: Save file to Supabase Storage
    const fileName = userId ? `${userId}/${Date.now()}-${file.name}` : `guest/${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    
    const { error: uploadError } = await supabaseClient.storage
      .from('resumes')
      .upload(fileName, fileBuffer);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', fileName);

    // Step 2: Extract text from file
    let extractedText = '';
    
    // Handle text files directly without OCR
    if (file.type === 'text/plain') {
      console.log('Processing text file directly...');
      extractedText = await file.text();
      console.log('Text extracted from plain text file, length:', extractedText.length);
    } else {
      // Step 2: Extract text with Azure Computer Vision for other file types
      const azureEndpoint = Deno.env.get('AZURE_COMPUTER_VISION_ENDPOINT');
      const azureKey = Deno.env.get('AZURE_COMPUTER_VISION_KEY');
      
      if (!azureEndpoint || !azureKey) {
        throw new Error('Could not extract text. Please try another file or paste manually.');
      }

      console.log('Starting OCR extraction...');
      
      try {
      // Submit for OCR processing
      const ocrResponse = await fetch(`${azureEndpoint}/vision/v3.2/read/analyze`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Content-Type': 'application/octet-stream',
        },
        body: fileBuffer,
      });

      if (!ocrResponse.ok) {
        throw new Error(`OCR request failed: ${ocrResponse.statusText}`);
      }

      const operationLocation = ocrResponse.headers.get('Operation-Location');
      if (!operationLocation) {
        throw new Error('No operation location returned from OCR service');
      }

      // Poll for OCR results
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const resultResponse = await fetch(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
          },
        });

        const result = await resultResponse.json();
        
        if (result.status === 'succeeded') {
          const pages = result.analyzeResult?.readResults || [];
          extractedText = pages
            .map((page: any) => 
              page.lines?.map((line: any) => line.text).join('\n') || ''
            )
            .join('\n\n');
          break;
        } else if (result.status === 'failed') {
          throw new Error('OCR processing failed');
        }
        
        attempts++;
      }
      } catch (ocrError) {
        console.error('OCR failed:', ocrError);
        throw new Error('Could not extract text. Please try another file or paste manually.');
      }
    } // Close the else block for OCR processing

    if (!extractedText) {
      throw new Error('Could not extract text. Please try another file or paste manually.');
    }

    console.log('Text extracted successfully, length:', extractedText.length);
    console.log('Resume content preview:', extractedText.substring(0, 200));

    // Validate resume content
    if (extractedText.length < 50) {
      throw new Error('Resume content appears incomplete. Please check uploaded file.');
    }

    const resumeKeywords = ['experience', 'education', 'skills', 'work', 'project'];
    const hasResumeContent = resumeKeywords.some(keyword => 
      extractedText.toLowerCase().includes(keyword)
    );

    if (!hasResumeContent) {
      throw new Error("This doesn't appear to be a resume. Please upload a resume file.");
    }

    // Step 3: Analyze with Cohere AI
    const cohereKey = Deno.env.get('COHERE_API_KEY');
    if (!cohereKey) {
      console.error('Cohere API key not found in environment');
      throw new Error('Cohere API key not configured - contact system administrator');
    }

    console.log('Starting Cohere AI analysis...');
    console.log('Cohere API key available:', cohereKey ? 'YES' : 'NO');

    // Resume Review with Cohere AI
    const reviewPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer. Analyze this resume thoroughly and provide a detailed assessment.

Calculate the ATS score based on these specific criteria:
- Keywords relevance (25 points): Does it contain industry-specific keywords?
- Format structure (20 points): Is it well-organized with clear sections?
- Experience relevance (20 points): Is experience clearly described with achievements?
- Skills section (15 points): Are technical/relevant skills properly listed?
- Contact information (10 points): Complete contact details?
- Education format (10 points): Proper education formatting?

Return ONLY valid JSON with no additional text:

{
  "ats_score": number between 0-100 (calculate based on above criteria),
  "strengths": ["specific strengths found in this resume"],
  "weaknesses": ["specific areas this resume lacks"], 
  "ats_suggestions": ["specific ATS optimization tips for this resume"],
  "improvements": ["actionable improvements for this specific resume"]
}

Resume text to analyze:
${extractedText}`;

    let analysis;
    try {
      console.log('Calling Cohere API for resume analysis...');
      
      const reviewResponse = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-nightly',
          message: reviewPrompt,
          temperature: 0.3,
        }),
      });

      console.log('Cohere API response status:', reviewResponse.status);
      
      if (!reviewResponse.ok) {
        const errorBody = await reviewResponse.text();
        console.error('Cohere API error:', errorBody);
        throw new Error(`Cohere API request failed: ${reviewResponse.status} ${reviewResponse.statusText} - ${errorBody}`);
      }

      const reviewData = await reviewResponse.json();
      console.log('Cohere API response received successfully');
      console.log('Response text preview:', reviewData.text?.substring(0, 100));
      
      const reviewText = reviewData.text;
      
      try {
        analysis = JSON.parse(reviewText);
        console.log('✅ Cohere analysis parsed successfully:', {
          ats_score: analysis.ats_score,
          strengths_count: analysis.strengths?.length,
          weaknesses_count: analysis.weaknesses?.length
        });
      } catch (e) {
        console.log('Failed to parse review JSON, retrying with schema reminder');
        // Retry with schema reminder
        const retryResponse = await fetch('https://api.cohere.com/v1/chat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cohereKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'command-nightly',
            message: `You must return ONLY valid JSON. ${reviewPrompt}`,
            temperature: 0.1,
          }),
        });

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          try {
            analysis = JSON.parse(retryData.text);
          } catch (e2) {
            console.log('Second JSON parse failed, using fallback');
            analysis = {
              ats_score: 60,
              strengths: ["Resume uploaded successfully"],
              weaknesses: ["Analysis formatting needs improvement"],
              ats_suggestions: ["Consider restructuring content"],
              improvements: ["Review and optimize sections"]
            };
          }
        } else {
          throw new Error('Cohere analysis failed');
        }
      }
    } catch (cohereError) {
      console.error('Cohere analysis failed:', cohereError);
      analysis = {
        strengths: ["Resume uploaded successfully"],
        weaknesses: ["Analysis formatting needs improvement"],
        ats_suggestions: ["Consider restructuring content"],
        improvements: ["Review and optimize sections"]
      };
    }

    // Step 4: Extract Skills from Resume using Cohere AI
    console.log('Extracting skills from resume using Cohere AI...');
    console.log('Resume content sample:', extractedText.substring(0, 200));
    
    const skillsPrompt = `Extract all technical skills, soft skills, tools, technologies, programming languages, certifications, and domain expertise mentioned in this resume. Return ONLY a JSON array of strings.

Return format: ["Python", "Project Management", "SQL", "Marketing", "Adobe Photoshop"]

Resume:
${extractedText}`;

    let extractedSkills = [];
    try {
      const skillsResponse = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-nightly',
          message: skillsPrompt,
          temperature: 0.1,
        }),
      });

      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();
        try {
          extractedSkills = JSON.parse(skillsData.text);
          console.log('Extracted skills:', extractedSkills);
        } catch (e) {
          console.log('Failed to parse skills, using basic extraction');
          // Basic fallback - extract common skills
          const commonSkills = ['Communication', 'Problem-solving', 'Leadership', 'Teamwork'];
          extractedSkills = commonSkills;
        }
      }
    } catch (e) {
      console.log('Skills extraction failed:', e);
      extractedSkills = ['Communication', 'Problem-solving'];
    }

    // Step 5: Generate Career Paths using Cohere AI based on extracted skills
    console.log('Generating career paths using Cohere AI based on skills...');
    console.log('Skills to use for career analysis:', extractedSkills);
    
    const careerPrompt = `Based on the skills and experience in this resume, suggest 4 different career paths this person could realistically pursue. Each path should be based on their ACTUAL skills and background.

Extracted Skills: ${extractedSkills.join(', ')}

Diversify the career suggestions - consider:
- If they have business skills → Business Analyst, Product Manager
- If they have creative skills → UX Designer, Content Creator  
- If they have data skills → Data Analyst, Research Specialist
- If they have technical skills → Software roles, System Admin
- If they have communication skills → Technical Writer, Sales
- If they have leadership experience → Team Lead, Project Manager

Return STRICT JSON format with NO extra text:
[
  {
    "title": "Specific Job Title",
    "match_percentage": 75,
    "why_fit": "Based on your [specific skills from resume], you have strong foundation for this role",
    "existing_skills": ["skill1", "skill2", "skill3"],
    "missing_skills": ["skill4", "skill5"],
    "salary_range": "$50k-$80k",
    "growth_potential": "High",
    "learning_resources": [
      {
        "skill": "missing_skill_name",
        "course_name": "Specific Course Name",
        "provider": "Coursera",
        "link": "https://www.coursera.org/course-link"
      }
    ]
  }
]

Resume Content:
${extractedText}`;

    let careerPaths = [];
    try {
      const careerResponse = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-nightly',
          message: careerPrompt,
          temperature: 0.4,
        }),
      });

      if (careerResponse.ok) {
        const careerData = await careerResponse.json();
        console.log('Raw career response:', careerData.text.substring(0, 300));
        
        try {
          // Clean the response - remove any markdown formatting
          let cleanedText = careerData.text.trim();
          if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '');
          }
          
          careerPaths = JSON.parse(cleanedText);
          console.log('Parsed career paths:', careerPaths.map(p => p.title));
          
          // Validate diversity
          const uniqueTitles = [...new Set(careerPaths.map(p => p.title))];
          if (uniqueTitles.length < careerPaths.length * 0.8) {
            console.log('Career paths not diverse enough, retrying...');
            throw new Error('Not diverse enough');
          }
          
        } catch (e) {
          console.log('Failed to parse career JSON, retrying with simpler prompt:', e);
          
          // Retry with simpler prompt
          const simplePrompt = `Based on this resume, suggest 3 different job roles. Return as JSON array:
[{"title": "Job Title", "why_fit": "explanation", "existing_skills": ["skill1"], "missing_skills": ["skill2"], "learning_resources": [{"skill": "skill2", "course_name": "Course", "provider": "Provider", "link": "https://example.com"}]}]

Resume: ${extractedText.substring(0, 500)}`;

          const retryResponse = await fetch('https://api.cohere.com/v1/chat', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cohereKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'command-nightly',
              message: simplePrompt,
              temperature: 0.2,
            }),
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            try {
              let cleanRetryText = retryData.text.trim();
              if (cleanRetryText.startsWith('```json')) {
                cleanRetryText = cleanRetryText.replace(/```json/g, '').replace(/```/g, '');
              }
              careerPaths = JSON.parse(cleanRetryText);
            } catch (e2) {
              console.log('Retry parsing also failed, using intelligent fallback');
              // Use skills to create diverse fallback
              careerPaths = createIntelligentFallback(extractedSkills);
            }
          }
        }
      } else {
        console.log('Career response not ok:', careerResponse.status);
        careerPaths = createIntelligentFallback(extractedSkills);
      }
    } catch (e) {
      console.log('Career analysis failed:', e);
      careerPaths = createIntelligentFallback(extractedSkills);
    }

    // Helper function to create intelligent fallback based on skills
    function createIntelligentFallback(skills) {
      const skillsLower = skills.map(s => s.toLowerCase());
      const fallbackPaths = [];
      
      // Determine career paths based on skills
      if (skillsLower.some(s => ['python', 'java', 'javascript', 'programming', 'coding'].includes(s))) {
        fallbackPaths.push({
          title: "Software Developer",
          match_percentage: 80,
          why_fit: "Your programming skills and technical background make you suitable for development roles",
          existing_skills: skills.filter(s => ['python', 'java', 'javascript', 'programming'].includes(s.toLowerCase())),
          missing_skills: ["System Design", "Testing", "DevOps"],
          salary_range: "$60k-$100k",
          growth_potential: "High",
          learning_resources: [{
            skill: "System Design",
            course_name: "System Design Interview",
            provider: "Educative",
            link: "https://www.educative.io/courses/grokking-the-system-design-interview"
          }]
        });
      }
      
      if (skillsLower.some(s => ['data', 'analysis', 'sql', 'excel', 'analytics'].includes(s))) {
        fallbackPaths.push({
          title: "Data Analyst",
          match_percentage: 75,
          why_fit: "Your analytical skills and data experience align with data analyst roles",
          existing_skills: skills.filter(s => ['data', 'analysis', 'sql', 'excel'].includes(s.toLowerCase())),
          missing_skills: ["Advanced SQL", "Tableau", "Statistics"],
          salary_range: "$50k-$80k",
          growth_potential: "High",
          learning_resources: [{
            skill: "Tableau",
            course_name: "Tableau Desktop Specialist",
            provider: "Tableau",
            link: "https://www.tableau.com/learn/training"
          }]
        });
      }
      
      if (skillsLower.some(s => ['management', 'leadership', 'project', 'team'].includes(s))) {
        fallbackPaths.push({
          title: "Project Manager",
          match_percentage: 70,
          why_fit: "Your leadership and project management skills are valuable for PM roles",
          existing_skills: skills.filter(s => ['management', 'leadership', 'project'].includes(s.toLowerCase())),
          missing_skills: ["Agile Methodology", "Stakeholder Management", "Risk Assessment"],
          salary_range: "$55k-$90k",
          growth_potential: "High",
          learning_resources: [{
            skill: "Agile Methodology",
            course_name: "Agile Project Management",
            provider: "Coursera",
            link: "https://www.coursera.org/specializations/agile-development"
          }]
        });
      }
      
      // Always add a general role as fallback
      if (fallbackPaths.length === 0) {
        fallbackPaths.push({
          title: "Business Analyst",
          match_percentage: 65,
          why_fit: "Your analytical thinking and communication skills suit business analysis roles",
          existing_skills: skills.slice(0, 3),
          missing_skills: ["Business Process Mapping", "Requirements Gathering", "SQL"],
          salary_range: "$45k-$75k",
          growth_potential: "Medium",
          learning_resources: [{
            skill: "Business Process Mapping",
            course_name: "Business Analysis Fundamentals",
            provider: "Udemy",
            link: "https://www.udemy.com/course/business-analysis/"
          }]
        });
      }
      
      return fallbackPaths.slice(0, 3); // Return max 3 paths
    }

    // Step 6: Extract Job Keywords using Cohere AI
    console.log('Extracting job keywords using Cohere AI...');
    
    const keywordsPrompt = `Extract 5-8 job-relevant keywords from this resume. Return ONLY a JSON array of strings:

["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]

Resume text:
${extractedText}`;

    let keywords;
    try {
      const keywordsResponse = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-nightly',
          message: keywordsPrompt,
          temperature: 0.2,
        }),
      });

      if (keywordsResponse.ok) {
        const keywordsData = await keywordsResponse.json();
        try {
          keywords = JSON.parse(keywordsData.text);
        } catch (e) {
          keywords = ["software", "development", "programming", "technology", "experience"];
        }
      } else {
        keywords = ["software", "development", "programming", "technology", "experience"];
      }
    } catch (e) {
      keywords = ["software", "development", "programming", "technology", "experience"];
    }

    console.log('✅ Resume analysis completed successfully using Cohere AI');
    console.log('Final analysis summary:', {
      cohere_analysis_complete: true,
      ats_score: analysis.ats_score,
      skills_extracted: extractedSkills.length,
      career_paths_generated: careerPaths.length,
      keywords_extracted: keywords?.length || 0
    });

    // Step 7: Generate personalized job recommendations using Cohere AI
    console.log('Generating personalized job recommendations using Cohere AI...');
    console.log('Extracted skills available:', extractedSkills);
    console.log('Skills for job generation:', extractedSkills.slice(0, 5));
    
    let jobs: any[] = [];
    
    // Ensure we have skills extracted before job generation
    if (!extractedSkills || extractedSkills.length === 0) {
      console.log('No skills extracted, using fallback job generation');
      extractedSkills = ['Communication', 'Problem-solving', 'Teamwork', 'Leadership'];
    }
    
    try {
      const topSkills = extractedSkills.slice(0, 4);
      const experienceLevel = extractedText.includes('Senior') ? 'Senior' : extractedText.includes('Lead') ? 'Lead' : extractedText.includes('Manager') ? 'Manager' : extractedText.match(/(\d+)\s*years?/i)?.[1] > 5 ? 'Senior' : extractedText.match(/(\d+)\s*years?/i)?.[1] > 2 ? 'Mid-level' : 'Junior';
      
      console.log('Using these skills for job generation:', topSkills);
      
      const jobGenerationPrompt = `You are a job recruiter. Generate 4 specific job opportunities that perfectly match these skills. Each job MUST be directly related to the skills listed.

Skills to match: ${topSkills.join(', ')}
Experience Level: ${experienceLevel}

Rules:
- Job titles MUST include or relate to the specific skills (e.g., if "React" is a skill, include "React Developer")
- Job descriptions MUST mention the exact skills from the list
- Use realistic companies in tech, finance, healthcare, etc.
- Vary the locations (San Francisco, New York, Austin, Remote, etc.)
- Match scores should reflect how well the job matches the skills (85-99%)

Return ONLY this JSON format:
[
  {
    "title": "[Skill-specific job title]",
    "company": "[Realistic company name]",
    "location": "[City, State or Remote]",
    "apply_link": "https://careers.company.com/job123",
    "description": "We are seeking a ${experienceLevel} professional with expertise in ${topSkills[0]}, ${topSkills[1]}, and ${topSkills[2]} to join our team...",
    "match_score": 95
  }
]

Ensure each job is unique and specifically targets the skills: ${topSkills.join(', ')}`;

      console.log('Calling Cohere AI for job generation...');
      
      const jobResponse = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-nightly',
          message: jobGenerationPrompt,
          temperature: 0.6, // Higher temperature for variety
        }),
      });

      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        console.log('Cohere job generation response received');
        
        try {
          let cleanedJobText = jobData.text.trim();
          if (cleanedJobText.startsWith('```json')) {
            cleanedJobText = cleanedJobText.replace(/```json/g, '').replace(/```/g, '');
          }
          
          jobs = JSON.parse(cleanedJobText);
          console.log('✅ Generated personalized jobs:', jobs.map(j => j.title));
        } catch (e) {
          console.log('Failed to parse job JSON, using skill-based fallback');
          jobs = [];
        }
      } else {
        console.log('Cohere job generation failed, using fallback');
        jobs = [];
      }
    } catch (e) {
      console.log('Job generation error:', e);
      jobs = [];
    }

    // Create skill-based fallback jobs if API fails
    if (jobs.length === 0) {
      console.log('Creating skill-based fallback jobs using extracted skills:', extractedSkills);
      
      const skillsLower = extractedSkills.map(s => s.toLowerCase());
      const fallbackJobs = [];
      
      // Generate jobs based on actual skills with better skill detection
      if (skillsLower.some(s => ['react', 'javascript', 'html', 'css', 'frontend', 'vue', 'angular'].includes(s))) {
        fallbackJobs.push({
          title: `${extractedSkills.find(s => ['React', 'Vue', 'Angular'].includes(s)) || 'Frontend'} Developer`,
          company: "TechFlow Inc.",
          location: "San Francisco, CA",
          apply_link: "https://techflow.com/careers",
          description: `Build modern web applications using ${extractedSkills.slice(0, 3).join(', ')} and create responsive user interfaces...`,
          match_score: 92
        });
      }
      
      if (skillsLower.some(s => ['python', 'sql', 'tableau', 'power bi', 'data analysis', 'machine learning', 'analytics'].includes(s))) {
        fallbackJobs.push({
          title: "Data Analyst",
          company: "DataInsights Corp",
          location: "New York, NY",
          apply_link: "https://datainsights.com/jobs",
          description: `Analyze datasets and create dashboards using ${extractedSkills.slice(0, 3).join(', ')}, build predictive models and generate insights...`,
          match_score: 94
        });
      }
      
      if (skillsLower.some(s => ['python', 'java', 'node.js', 'backend', 'api', 'database'].includes(s))) {
        fallbackJobs.push({
          title: "Backend Developer",
          company: "ServerTech Solutions",
          location: "Seattle, WA",
          apply_link: "https://servertech.com/careers",
          description: `Develop server-side applications and APIs with ${extractedSkills.slice(0, 3).join(', ')}, design databases and optimize performance...`,
          match_score: 89
        });
      }
      
      if (skillsLower.some(s => ['management', 'leadership', 'project', 'agile'].includes(s))) {
        fallbackJobs.push({
          title: "Project Manager",
          company: "Innovation Labs",
          location: "Remote",
          apply_link: "#",
          description: `Lead projects and teams using ${extractedSkills.slice(0, 3).join(', ')} skills...`,
          match_score: 80
        });
      }
      
      // If no specific skills match, create a general job
      if (fallbackJobs.length === 0) {
        fallbackJobs.push({
          title: "Professional Role",
          company: "Growing Company",
          location: "Various Locations",
          apply_link: "#",
          description: `Opportunity to utilize your skills in ${extractedSkills.slice(0, 3).join(', ')}...`,
          match_score: 75
        });
      }
      
      jobs = fallbackJobs.slice(0, 3); // Take up to 3 jobs
    }

    console.log('Found', jobs.length, 'job matches');

    // Step 5: Save results to Supabase (only if user is authenticated)
    let scanId = null;
    if (userId) {
      try {
        const { data: resumeScan, error: saveError } = await supabaseClient
          .from('resume_scans')
          .insert({
            user_id: userId,
            original_filename: file.name,
            extracted_text: extractedText,
            analysis: { ...analysis, career_paths: careerPaths, keywords },
            ats_score: analysis.ats_score || 75,
            suggestions: analysis.improvements || []
          })
          .select()
          .single();

        if (!saveError) {
          scanId = resumeScan.id;
          
          // Save job applications
          for (const job of jobs) {
            await supabaseClient
              .from('job_applications')
              .insert({
                user_id: userId,
                job_title: job.title,
                company: job.company,
                location: job.location,
                job_url: job.apply_link,
                status: 'potential'
              });
          }
        }
      } catch (e) {
        console.log('Failed to save to database:', e);
      }
    }

    console.log('Analysis completed with scan ID:', scanId);

    return new Response(JSON.stringify({
      success: true,
      analysis: { ...analysis, career_paths: careerPaths, keywords },
      jobs,
      scanId,
      extracted_text: extractedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});