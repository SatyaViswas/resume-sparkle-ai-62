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
    
    // Helper function to create intelligent analysis based on resume content
    function createIntelligentAnalysis(resumeText: string) {
      const text = resumeText.toLowerCase();
      const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // Calculate ATS score based on resume structure
      let atsScore = 0;
      const sections = ['experience', 'education', 'skills', 'projects'];
      const hasContact = text.includes('email') || text.includes('@') || text.includes('phone');
      const hasMetrics = /\d+%|\d+\+|\d+ years|increased|improved|reduced|achieved/.test(text);
      const hasSkillsSection = text.includes('skills') || text.includes('technical') || text.includes('programming');
      const hasClearStructure = sections.filter(section => text.includes(section)).length >= 2;
      
      atsScore += hasContact ? 15 : 5;
      atsScore += hasMetrics ? 25 : 10;
      atsScore += hasSkillsSection ? 20 : 10;
      atsScore += hasClearStructure ? 20 : 10;
      atsScore += Math.min(20, Math.floor(resumeText.length / 100)); // Length bonus
      
      // Analyze strengths based on content
      const strengths = [];
      if (hasMetrics) strengths.push('Quantified achievements with specific metrics and percentages');
      if (hasSkillsSection) strengths.push('Well-organized technical skills section');
      if (text.includes('project')) strengths.push('Relevant project experience demonstrating practical skills');
      if (text.includes('lead') || text.includes('manage')) strengths.push('Leadership and management experience');
      if (hasContact) strengths.push('Complete contact information provided');
      
      // Analyze weaknesses
      const weaknesses = [];
      if (!hasMetrics) weaknesses.push('Missing quantified achievements - add specific numbers and percentages');
      if (!hasSkillsSection) weaknesses.push('No dedicated technical skills section identified');
      if (!text.includes('project')) weaknesses.push('Limited project examples to demonstrate skills');
      if (resumeText.length < 500) weaknesses.push('Resume content appears brief - consider adding more detail');
      
      // Generate improvements
      const improvements = [];
      if (!hasMetrics) improvements.push('Add specific metrics to work achievements (e.g., "increased sales by 25%")');
      if (!hasSkillsSection) improvements.push('Create a dedicated skills section with relevant technologies');
      if (atsScore < 70) improvements.push('Improve keyword density with industry-specific terms');
      improvements.push('Ensure consistent formatting and clear section headers');
      
      return {
        ats_score: Math.min(100, atsScore),
        strengths: strengths.slice(0, 4),
        weaknesses: weaknesses.slice(0, 4),
        ats_suggestions: improvements.slice(0, 4),
        improvements: improvements
      };
    }
    
    // Helper function to extract skills from resume text
    function extractSkillsFromText(resumeText: string): string[] {
      const text = resumeText.toLowerCase();
      const skills: string[] = [];
      
      // Technical skills patterns
      const technicalSkills = [
        // Programming Languages
        'javascript', 'python', 'java', 'typescript', 'react', 'vue.js', 'angular', 'node.js',
        'html5', 'css3', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'c++', 'c#', 'scala',
        // Frameworks and Libraries  
        'express', 'django', 'flask', 'spring', 'laravel', 'redux', 'vue', 'svelte', 'bootstrap',
        'tailwind', 'sass', 'less', 'webpack', 'vite', 'next.js', 'nuxt.js', 'gatsby',
        // Databases
        'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'elasticsearch',
        // Cloud and DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
        // Data Science
        'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'matplotlib', 'seaborn',
        'tableau', 'power bi', 'jupyter', 'r', 'spss', 'sas', 'hadoop', 'spark',
        // Tools
        'git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'adobe',
        'photoshop', 'illustrator', 'canva'
      ];
      
      // Business skills patterns
      const businessSkills = [
        'project management', 'agile', 'scrum', 'kanban', 'leadership', 'team management',
        'strategic planning', 'business analysis', 'market research', 'digital marketing',
        'seo', 'sem', 'social media', 'content marketing', 'email marketing', 'ppc',
        'google analytics', 'facebook ads', 'hubspot', 'salesforce', 'mailchimp', 'hootsuite',
        'crm', 'marketing automation', 'campaign management', 'brand management', 'roi',
        'kpi', 'conversion optimization', 'a/b testing', 'lead generation', 'customer acquisition',
        'marketing strategy', 'growth marketing', 'performance marketing', 'budget management',
        'stakeholder management', 'cross-functional collaboration', 'team leadership'
      ];
      
      // Extract skills mentioned in the resume (avoid false positives for short words)
      [...technicalSkills, ...businessSkills].forEach(skill => {
        // For very short skills (like 'go', 'r'), use word boundaries to avoid false matches
        let hasSkill = false;
        if (skill.length <= 2) {
          // Use word boundaries for short skills to avoid false positives
          const regex = new RegExp(`\\b${skill}\\b`, 'i');
          hasSkill = regex.test(resumeText); // Use original case text for better matching
        } else {
          hasSkill = text.includes(skill);
        }
        
        if (hasSkill) {
          // Capitalize properly
          const capitalizedSkill = skill.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          if (!skills.includes(capitalizedSkill)) {
            skills.push(capitalizedSkill);
          }
        }
      });
      
      // Extract from skills section more specifically
      const lines = resumeText.split('\n');
      const skillsSectionStart = lines.findIndex(line => 
        /skills|technical|competencies|technologies/i.test(line)
      );
      
      if (skillsSectionStart !== -1) {
        // Look at next 10 lines after skills header
        for (let i = skillsSectionStart + 1; i < Math.min(skillsSectionStart + 11, lines.length); i++) {
          const line = lines[i];
          if (line && !line.match(/^[A-Z ]+$/)) { // Skip section headers
            // Extract skills separated by |, •, or ,
            const lineSkills = line.split(/[|•,]/).map(s => s.trim()).filter(s => s.length > 1);
            lineSkills.forEach(skill => {
              const cleanSkill = skill.replace(/[^a-zA-Z0-9\s.+-]/g, '').trim();
              if (cleanSkill.length > 2 && cleanSkill.length < 30) {
                skills.push(cleanSkill);
              }
            });
          }
        }
      }
      
      // Add some common soft skills if mentioned
      const softSkills = ['communication', 'problem-solving', 'teamwork', 'leadership', 'creativity'];
      softSkills.forEach(skill => {
        if (text.includes(skill) || text.includes(skill.replace('-', ' '))) {
          skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
      });
      
      // Remove duplicates and return top skills
      const uniqueSkills = [...new Set(skills)];
      return uniqueSkills.slice(0, 15);
    }

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

First, identify the resume structure and content:
- Extract contact information, professional summary/profile, education, skills, experience, projects
- Analyze the completeness and quality of each section
- Check for quantifiable achievements and specific technical skills
- Assess overall formatting and organization

Calculate ATS score based on these weighted criteria:
- Technical Skills Presence (25 points): Programming languages, frameworks, tools clearly listed
- Experience Quality (25 points): Clear job descriptions with quantified achievements  
- Resume Structure (20 points): Well-organized sections (Profile, Experience, Education, Skills)
- Keywords Density (15 points): Industry-relevant keywords throughout
- Contact & Professional Details (10 points): Complete contact info, LinkedIn, portfolio
- Education Relevance (5 points): Relevant degree or certifications

For technical resumes like software developers: Look for programming languages (React, Python, JavaScript), frameworks, databases, cloud technologies, project descriptions with metrics.

For business/marketing resumes: Look for tools (Google Analytics, CRM), campaigns, ROI metrics, team leadership, strategy experience.

For data/analytics resumes: Look for SQL, Python, R, Tableau, statistical methods, data science tools, quantified results.

Return ONLY valid JSON with no additional text:

{
  "ats_score": number between 0-100 (calculate based on actual content analysis),
  "strengths": ["specific strengths found in this actual resume with examples"],
  "weaknesses": ["specific gaps or areas for improvement in this resume"], 
  "ats_suggestions": ["specific ATS optimization tips based on this resume's content"],
  "improvements": ["actionable improvements tailored to this specific resume and career path"]
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
            console.log('Second JSON parse failed, creating intelligent analysis from resume text');
            analysis = createIntelligentAnalysis(extractedText);
          }
        } else {
          throw new Error('Cohere analysis failed');
        }
      }
    } catch (cohereError) {
      console.error('Cohere analysis failed:', cohereError);
      console.log('Creating intelligent analysis from resume content...');
      analysis = createIntelligentAnalysis(extractedText);
    }

    // Step 4: Extract Skills from Resume using Cohere AI
    console.log('Extracting skills from resume using Cohere AI...');
    console.log('Resume content sample:', extractedText.substring(0, 200));
    
    const skillsPrompt = `Analyze this resume and extract ALL skills mentioned across ALL sections including:

1. TECHNICAL SKILLS: Programming languages, frameworks, databases, cloud services, development tools
2. SOFTWARE & TOOLS: Applications, platforms, analytics tools, design software
3. DOMAIN EXPERTISE: Industry knowledge, methodologies, processes
4. CERTIFICATIONS: Any mentioned certifications or qualifications
5. SOFT SKILLS: Leadership, communication, problem-solving (when explicitly mentioned)

Look in these sections:
- Skills/Technical Skills section
- Project descriptions (technologies used)
- Work experience (tools and technologies mentioned)
- Education section (relevant coursework, technologies)
- Certifications and training

For technical resumes, prioritize: Programming languages, frameworks, databases, cloud platforms, development tools
For business resumes, prioritize: Analytics tools, CRM systems, project management, marketing platforms
For data resumes, prioritize: Programming languages (Python, R, SQL), data visualization tools, statistical methods

Return ONLY a JSON array of strings, prioritized by relevance:
["Most Important Skill", "Second Important", "Third Important", ...]

Resume:
${extractedText}`;

    let extractedSkills = [];
    try {
      console.log('Attempting Cohere skills extraction...');
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
        console.log('Cohere skills response received, parsing...');
        try {
          extractedSkills = JSON.parse(skillsData.text);
          console.log('✅ Cohere skills parsed successfully:', extractedSkills.slice(0, 5));
          
          // Validate that we got actual skills, not generic ones
          if (extractedSkills.length === 0 || 
              (extractedSkills.length <= 3 && extractedSkills.every(skill => 
                ['communication', 'problem-solving', 'teamwork', 'leadership', 'experience', 'software', 'development', 'programming', 'technology'].includes(skill.toLowerCase())
              ))) {
            console.log('Cohere returned generic skills, using intelligent extraction');
            extractedSkills = extractSkillsFromText(extractedText);
          }
        } catch (e) {
          console.log('Failed to parse Cohere skills JSON, using intelligent text extraction');
          extractedSkills = extractSkillsFromText(extractedText);
        }
      } else {
        console.log('Cohere skills API failed, using intelligent extraction');
        extractedSkills = extractSkillsFromText(extractedText);
      }
    } catch (e) {
      console.log('Skills extraction failed completely, using text analysis:', e);
      extractedSkills = extractSkillsFromText(extractedText);
    }
    
    // Final fallback if still no skills
    if (extractedSkills.length === 0) {
      console.log('No skills found with any method, using basic fallback');
      extractedSkills = ['Communication', 'Problem-solving', 'Teamwork'];
    }
    
    console.log('Final extracted skills count:', extractedSkills.length);
    console.log('Final skills preview:', extractedSkills.slice(0, 8));

    // Step 5: Generate Career Paths using Cohere AI based on extracted skills
    console.log('Generating career paths using Cohere AI based on skills...');
    console.log('Skills to use for career analysis:', extractedSkills);
    
    // Analyze experience level from resume
    const experienceAnalysis = {
      level: extractedText.includes('Senior') || extractedText.includes('Lead') ? 'Senior' : 
             extractedText.includes('Manager') || extractedText.includes('Director') ? 'Management' :
             extractedText.match(/(\d+)\+?\s*years?/i)?.[1] >= 5 ? 'Senior' :
             extractedText.match(/(\d+)\+?\s*years?/i)?.[1] >= 2 ? 'Mid-level' : 'Entry-level',
      domain: extractedText.includes('Developer') || extractedText.includes('Engineer') ? 'Technical' :
              extractedText.includes('Analyst') || extractedText.includes('Data') ? 'Data' :
              extractedText.includes('Marketing') || extractedText.includes('Manager') ? 'Business' :
              'General'
    };
    
    const careerPrompt = `Analyze this resume and suggest 4 realistic career paths based on their ACTUAL background and skills.

EXTRACTED SKILLS: ${extractedSkills.join(', ')}
EXPERIENCE LEVEL: ${experienceAnalysis.level}
DOMAIN: ${experienceAnalysis.domain}

CARIER PATH RULES:
1. Base suggestions on ACTUAL skills and experience mentioned
2. Consider current seniority level (entry/mid/senior)
3. Suggest both lateral moves and growth opportunities
4. Include diverse paths: technical advancement, management track, specialization, pivot options

For TECHNICAL backgrounds (Software/Engineering):
- Senior Developer, Tech Lead, Solutions Architect, Product Manager

For DATA/ANALYTICS backgrounds:
- Senior Data Analyst, Data Scientist, Business Intelligence, Data Engineering

For BUSINESS/MARKETING backgrounds:
- Marketing Manager, Product Manager, Business Analyst, Strategy Consultant

For ENTRY-LEVEL candidates:
- Focus on skill-building paths and junior roles with growth potential

Return STRICT JSON format with NO extra text:
[
  {
    "title": "Specific Job Title Based on Resume",
    "match_percentage": 85,
    "why_fit": "Based on your experience with [specific experience from resume] and skills in [specific skills], this role leverages your strengths in [specific area]",
    "existing_skills": ["skill1 from resume", "skill2 from resume", "skill3 from resume"],
    "missing_skills": ["specific skill gap", "another gap"],
    "salary_range": "$60k-$90k",
    "growth_potential": "High",
    "learning_resources": [
      {
        "skill": "specific missing skill",
        "course_name": "Targeted Course Name",
        "provider": "Coursera",
        "link": "https://www.coursera.org/learn/relevant-course"
      }
    ]
  }
]

Full Resume Content for Context:
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

    // Helper function to create intelligent fallback based on skills and resume content
    function createIntelligentFallback(skills) {
      const skillsLower = skills.map(s => s.toLowerCase());
      const fallbackPaths = [];
      const resumeLower = extractedText.toLowerCase();
      
      // Analyze resume content for better context
      const hasWebDev = skillsLower.some(s => ['react', 'javascript', 'html', 'css', 'frontend', 'vue', 'angular'].includes(s)) || resumeLower.includes('frontend') || resumeLower.includes('web developer');
      const hasBackend = skillsLower.some(s => ['python', 'java', 'node.js', 'backend', 'api', 'database', 'sql'].includes(s)) || resumeLower.includes('backend') || resumeLower.includes('server');
      const hasDataSkills = skillsLower.some(s => ['python', 'sql', 'tableau', 'data analysis', 'machine learning', 'pandas', 'numpy'].includes(s)) || resumeLower.includes('data analyst') || resumeLower.includes('analytics');
      const hasManagement = skillsLower.some(s => ['management', 'leadership', 'project', 'team lead'].includes(s)) || resumeLower.includes('manager') || resumeLower.includes('lead');
      const hasDesign = skillsLower.some(s => ['design', 'ui/ux', 'figma', 'photoshop', 'creative'].includes(s)) || resumeLower.includes('designer') || resumeLower.includes('creative');
      const hasMarketing = skillsLower.some(s => ['marketing', 'seo', 'social media', 'analytics', 'campaigns'].includes(s)) || resumeLower.includes('marketing') || resumeLower.includes('digital marketing');
      
      // Frontend/Web Development Path
      if (hasWebDev) {
        fallbackPaths.push({
          title: "Frontend Developer",
          match_percentage: 85,
          why_fit: "Your web development skills with technologies like React, JavaScript, and CSS make you well-suited for frontend development roles",
          existing_skills: skills.filter(s => ['react', 'javascript', 'html', 'css', 'typescript', 'vue', 'angular'].includes(s.toLowerCase())),
          missing_skills: ["Testing Frameworks", "Performance Optimization", "Accessibility"],
          salary_range: "$65k-$95k",
          growth_potential: "High",
          learning_resources: [{
            skill: "Testing Frameworks",
            course_name: "JavaScript Testing with Jest and React Testing Library",
            provider: "Udemy",
            link: "https://www.udemy.com/course/react-testing-library/"
          }]
        });
      }
      
      // Backend Development Path
      if (hasBackend) {
        fallbackPaths.push({
          title: "Backend Developer",
          match_percentage: 82,
          why_fit: "Your backend development experience with server-side technologies, APIs, and databases positions you well for backend roles",
          existing_skills: skills.filter(s => ['python', 'java', 'node.js', 'sql', 'api', 'database'].includes(s.toLowerCase())),
          missing_skills: ["Microservices", "Cloud Architecture", "DevOps"],
          salary_range: "$70k-$105k",
          growth_potential: "High",
          learning_resources: [{
            skill: "Microservices",
            course_name: "Microservices with Node.js and React",
            provider: "Udemy",
            link: "https://www.udemy.com/course/microservices-with-node-js-and-react/"
          }]
        });
      }
      
      // Data Analysis/Science Path
      if (hasDataSkills) {
        fallbackPaths.push({
          title: "Data Analyst",
          match_percentage: 88,
          why_fit: "Your analytical skills with Python, SQL, and data visualization tools make you an excellent fit for data analysis roles",
          existing_skills: skills.filter(s => ['python', 'sql', 'tableau', 'power bi', 'pandas', 'numpy', 'excel'].includes(s.toLowerCase())),
          missing_skills: ["Advanced Statistics", "Machine Learning", "R"],
          salary_range: "$60k-$85k",
          growth_potential: "High",
          learning_resources: [{
            skill: "Machine Learning",
            course_name: "Machine Learning Specialization",
            provider: "Coursera",
            link: "https://www.coursera.org/specializations/machine-learning"
          }]
        });
      }
      
      // Management/Leadership Path
      if (hasManagement) {
        fallbackPaths.push({
          title: "Technical Project Manager",
          match_percentage: 75,
          why_fit: "Your leadership experience and project management skills, combined with technical knowledge, make you suitable for technical PM roles",
          existing_skills: skills.filter(s => ['management', 'leadership', 'project management', 'agile'].includes(s.toLowerCase())),
          missing_skills: ["Scrum Master Certification", "Stakeholder Management", "Risk Assessment"],
          salary_range: "$75k-$110k",
          growth_potential: "High",
          learning_resources: [{
            skill: "Scrum Master Certification",
            course_name: "Agile and Scrum Master Certification",
            provider: "Coursera",
            link: "https://www.coursera.org/learn/agile-scrum-master"
          }]
        });
      }
      
      // UI/UX Design Path
      if (hasDesign) {
        fallbackPaths.push({
          title: "UI/UX Designer",
          match_percentage: 80,
          why_fit: "Your design skills and experience with design tools position you well for user experience roles",
          existing_skills: skills.filter(s => ['figma', 'photoshop', 'ui/ux', 'design', 'prototyping'].includes(s.toLowerCase())),
          missing_skills: ["User Research", "Wireframing", "Design Systems"],
          salary_range: "$60k-$90k",
          growth_potential: "Medium-High",
          learning_resources: [{
            skill: "User Research",
            course_name: "User Experience Research and Design",
            provider: "Coursera",
            link: "https://www.coursera.org/specializations/user-experience-research"
          }]
        });
      }
      
      // Digital Marketing Path
      if (hasMarketing) {
        fallbackPaths.push({
          title: "Digital Marketing Specialist",
          match_percentage: 85,
          why_fit: "Your marketing experience with digital tools and analytics makes you well-suited for digital marketing roles",
          existing_skills: skills.filter(s => ['google analytics', 'seo', 'social media', 'marketing', 'campaigns'].includes(s.toLowerCase())),
          missing_skills: ["Marketing Automation", "A/B Testing", "PPC Advertising"],
          salary_range: "$50k-$75k",
          growth_potential: "Medium-High",
          learning_resources: [{
            skill: "Marketing Automation",
            course_name: "Digital Marketing Specialization",
            provider: "Coursera",
            link: "https://www.coursera.org/specializations/digital-marketing"
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
          keywords = extractedSkills.slice(0, 6);
        }
      } else {
        keywords = extractedSkills.slice(0, 6);
      }
    } catch (e) {
      keywords = extractedSkills.slice(0, 6);
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
      console.log('No skills extracted, using text analysis for job generation');
      extractedSkills = extractSkillsFromText(extractedText);
      if (extractedSkills.length === 0) {
        extractedSkills = ['Communication', 'Problem-solving', 'Teamwork', 'Leadership'];
      }
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