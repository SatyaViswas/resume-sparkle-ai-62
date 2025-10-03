// Test resume analysis with formats matching the provided resume images
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xwoeluhtkzednjetkgtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2VsdWh0a3plZG5qZXRrZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzYzMDQsImV4cCI6MjA3MjgxMjMwNH0.8HwgfaxrGEyPPNV90dwh64my9xzv-8Q4eFrJ7odySRY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test resumes based on the formats in the provided images
const testResumes = [
  {
    name: "Vara Prasad - AI/ML Student Resume",
    content: `Vara Prasad
Email: varap2584@gmail.com | Phone: 7658975169 | LinkedIn | GitHub | Hyderabad, India | Portfolio

PROFILE
I'm a second-year B.Tech student (AI/ML) with a solid grasp of data structures, web development, and cloud tools. I enjoy turning ideas into working solutions through clean code and smart problem-solving. I've built real-world projects using AI and full-stack technologies and actively contributed to open-source communities.

EDUCATION
NxtWave - CCBP Intensive 4.0 Tech Program                                    2024 – present
Web Development (MERN)
CCBP intensive is an industry-ready certification Program focused on full-stack web development that provides training through an immersive, hands-on and reverse-engineering curriculum

B V Raju Institute of Technology                                               2023 – present
Bachelor of Technology                                                          CGPA: 8.9/10
Electronics and communication engineering (AI/ML)

SKILLS
Web development — HTML5 | CSS3 | Vue.js | Flask | MYSQL
Programming language — Java | Python | Javascript
Competitive Programming — Data Structures and Algorithms
CS Fundamentals — DBMS | OOPS | OS
Tools — AWS(EC2,Lambda) | Git | GitHub

PROFESSIONAL EXPERIENCE
Brainwave Matrix Solutions                                                      06/2024 – 07/2024
Front-End Developer Intern                                                      Remote
Worked as a front-end developer intern at Brainwave Matrix Solutions. Designed and implemented user interfaces using HTML, CSS, and JavaScript for internal tools
• Collaborated with backend teams to integrate REST APIs and enhance data flow
• Delivered clean, responsive UI components, improving load speed by 20%
• Gained hands-on experience with full-stack development practices in a remote team environment

PROJECTS
1. AI-Driven Crop Disease Detection
Technologies: Vue.js | Python(Flask, Tensorflow) | CNN algorithm
• Developed an AI-powered tool using CNN to classify crop diseases from image datasets
• Integrated model into a web dashboard using Flask APIs and Vue.js for real-time predictions
• Enabled early disease detection to assist farmers in proactive crop management
• Achieved >90% accuracy on plant disease dataset from Kaggle

2. AI-Personalized Diabetes treatment
Technologies: HTML | CSS | JS | Python(Flask, Tensorflow) | DQN algorithm
• Developed an AI-powered web application that provides personalized diabetes treatment recommendations based on user-entered EHR data (glucose, BP, medications).
• Built a real-time visual dashboard that displays 24-hour glucose trends with color-coded risk indicators and AI-predicted spikes.
• Open source AI-model API via Flask backend to generate treatment suggestions and medical explanations, with downloadable reports in multiple formats (PDF/HTML).`
  },
  {
    name: "Rahul Sharma - Senior Software Engineer Resume",
    content: `Rahul Sharma
Email: rahulsharma@example.com | Phone: +91 98765 43210 | LinkedIn: linkedin.com/in/rahulsharma

Professional Summary
Detail-oriented software engineer with 2+ years of experience specializing in front-end development using JavaScript, React, and TypeScript. Passionate about building user-friendly, accessible web applications with a focus on performance and clean code.

Skills
• JavaScript, TypeScript, React, Redux
• HTML5, CSS3, Sass, Tailwind CSS
• REST APIs, GraphQL
• Git, CI/CD pipelines
• Agile methodologies

Professional Experience

Software Engineer
Tech Solutions Pvt Ltd, Bengaluru, IN
Jan 2023 – Present
• Developed and maintained React-based web applications used by 10,000+ users.
• Collaborated with UX designers and backend developers to implement new features efficiently.
• Improved web application performance by 20% by optimizing component rendering.

Intern - Frontend Development
Innovate Labs, Bengaluru, IN
Jun 2022 – Dec 2022
• Assisted in building responsive UI components using React and Redux.
• Conducted unit testing and debugged interface issues, improving code stability.

Education
B.Tech in Computer Science
Indian Institute of Technology, Delhi
Graduated: 2022

Certifications
• Certified JavaScript Developer, Udemy
• React - The Complete Guide, Coursera

Projects
Portfolio Website
Built a responsive portfolio website showcasing projects and skills using React and Bootstrap.`
  },
  {
    name: "Marketing Manager with Leadership Experience",
    content: `Sarah Johnson
Marketing Manager | Digital Strategy Expert
Email: sarah.johnson@email.com | Phone: (555) 123-4567 | LinkedIn | Portfolio

PROFESSIONAL SUMMARY
Results-driven Marketing Manager with 5+ years of experience in digital marketing, team leadership, and strategic campaign development. Proven track record of increasing ROI by 40% through data-driven marketing initiatives and cross-functional collaboration.

CORE COMPETENCIES
• Digital Marketing Strategy: SEO/SEM, Social Media Marketing, Content Marketing, Email Campaigns
• Analytics & Data: Google Analytics, Facebook Insights, Marketing Automation, A/B Testing
• Leadership & Management: Team Leadership (8+ members), Budget Management ($500k+), Project Management
• Creative Tools: Adobe Creative Suite, Canva, Video Editing, Graphic Design
• Marketing Technology: HubSpot, Salesforce, Mailchimp, Hootsuite

PROFESSIONAL EXPERIENCE

Senior Marketing Manager                                                        Jan 2021 – Present
GrowthTech Solutions, San Francisco, CA
• Lead integrated marketing campaigns for B2B SaaS products, managing $500k annual budget
• Increased qualified leads by 65% through strategic content marketing and SEO optimization
• Manage team of 8 marketing professionals across content, design, and digital channels
• Implemented marketing automation workflows, improving lead nurturing efficiency by 45%
• Collaborate with sales team to align marketing qualified leads with revenue targets

Digital Marketing Specialist                                                   Jun 2019 – Dec 2020
StartupHub Inc., New York, NY
• Developed and executed social media strategies across LinkedIn, Twitter, and Facebook
• Created content calendar and managed 50+ blog posts, increasing organic traffic by 80%
• Managed Google Ads and Facebook advertising campaigns with average ROAS of 4.2:1
• Conducted market research and competitor analysis to inform campaign strategy

Marketing Coordinator                                                          Mar 2018 – May 2019
BrandForce Agency, Chicago, IL
• Supported account managers in developing marketing materials for 15+ clients
• Coordinated trade show events and webinars, generating 200+ new leads per event
• Created email marketing campaigns achieving 28% open rates and 6% click-through rates

EDUCATION
Bachelor of Business Administration - Marketing                                 2014 – 2018
Northwestern University, Chicago, IL
GPA: 3.7/4.0

CERTIFICATIONS
• Google Analytics Certified (2023)
• Google Ads Certified (2023)
• HubSpot Inbound Marketing Certified (2022)
• Facebook Blueprint Certified (2022)

KEY ACHIEVEMENTS
• Increased overall marketing ROI from 2.1:1 to 3.8:1 over 2 years
• Grew company social media following from 5k to 25k across all platforms
• Led rebranding project that improved brand recognition by 35%
• Mentored 3 junior marketers, with 2 receiving internal promotions`
  },
  {
    name: "Data Scientist with Advanced Skills",
    content: `Dr. Michael Chen, PhD
Senior Data Scientist | Machine Learning Engineer
Email: michael.chen@email.com | Phone: (555) 987-6543 | LinkedIn | GitHub

PROFESSIONAL PROFILE
PhD-qualified Data Scientist with 6+ years of experience in machine learning, predictive analytics, and big data processing. Expert in developing end-to-end ML pipelines, statistical modeling, and translating business requirements into data-driven solutions.

TECHNICAL EXPERTISE
• Machine Learning: Scikit-learn, TensorFlow, PyTorch, Keras, XGBoost, Random Forest
• Programming: Python, R, SQL, Scala, Java
• Big Data & Cloud: Apache Spark, Hadoop, AWS (S3, EMR, SageMaker), Azure ML, GCP
• Data Visualization: Tableau, Power BI, Matplotlib, Plotly, D3.js
• Databases: PostgreSQL, MongoDB, Cassandra, Redis
• MLOps: Docker, Kubernetes, MLflow, Apache Airflow, CI/CD pipelines

PROFESSIONAL EXPERIENCE

Senior Data Scientist                                                          Aug 2021 – Present
TechInnovate Corp, Seattle, WA
• Lead data science initiatives for customer analytics and recommendation systems
• Developed deep learning models improving recommendation accuracy by 35%
• Built automated ML pipelines processing 10M+ records daily using Apache Spark
• Mentored team of 4 junior data scientists and established ML best practices
• Collaborated with product teams to A/B test ML features, increasing user engagement by 25%

Data Scientist                                                               Jan 2019 – Jul 2021
DataInsights Inc, Boston, MA
• Designed predictive models for customer churn, achieving 92% accuracy
• Implemented real-time fraud detection system reducing false positives by 40%
• Created automated reporting dashboards using Tableau and Python, saving 20 hours/week
• Performed statistical analysis on customer behavior data for strategic decision-making
• Led cross-functional projects with engineering and business teams

Research Data Analyst                                                         Sep 2018 – Dec 2018
MIT Research Lab, Cambridge, MA
• Analyzed genomic datasets using statistical methods and machine learning algorithms
• Published 2 peer-reviewed papers on computational biology and biostatistics
• Developed R packages for bioinformatics analysis, downloaded 1000+ times

EDUCATION
PhD in Statistics                                                             2014 – 2018
Massachusetts Institute of Technology, Cambridge, MA
Dissertation: "Advanced Statistical Methods for High-Dimensional Genomic Data"

Master of Science in Computer Science                                         2012 – 2014
Stanford University, Stanford, CA
Specialization: Machine Learning and Artificial Intelligence

Bachelor of Science in Mathematics                                            2008 – 2012
University of California, Berkeley, CA
Summa Cum Laude, Phi Beta Kappa

PUBLICATIONS & RESEARCH
• "Deep Learning Approaches for Genomic Sequence Analysis" - Nature Biotechnology (2018)
• "Statistical Methods for Single-Cell RNA Sequencing" - Bioinformatics (2017)
• Speaker at 5+ international conferences on data science and machine learning

CERTIFICATIONS
• AWS Certified Machine Learning - Specialty (2023)
• Google Cloud Professional Data Engineer (2022)
• Tableau Desktop Certified Associate (2021)`
  }
];

async function testResumeAnalysis(resumeData) {
  console.log(`\n🧪 Testing: ${resumeData.name}`);
  console.log('=' .repeat(80));

  try {
    const blob = new Blob([resumeData.content], { type: 'text/plain' });
    const file = new File([blob], `${resumeData.name.replace(/\s+/g, '_')}.txt`, { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', `test-${Date.now()}`);

    console.log('📤 Sending resume for analysis...');
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: formData,
    });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    if (data.success) {
      console.log('\n✅ Analysis Results:');
      console.log('─'.repeat(40));
      
      // ATS Score Analysis
      console.log(`📊 ATS Score: ${data.analysis.ats_score}/100`);
      if (data.analysis.ats_score >= 80) {
        console.log('   🟢 Excellent ATS compatibility');
      } else if (data.analysis.ats_score >= 60) {
        console.log('   🟡 Good ATS compatibility with room for improvement');
      } else {
        console.log('   🔴 Needs significant ATS optimization');
      }
      
      // Strengths Analysis
      console.log(`\n💪 Key Strengths (${data.analysis.strengths?.length || 0}):`);
      data.analysis.strengths?.forEach((strength, idx) => {
        console.log(`   ${idx + 1}. ${strength}`);
      });
      
      // Weaknesses Analysis
      console.log(`\n⚠️  Areas for Improvement (${data.analysis.weaknesses?.length || 0}):`);
      data.analysis.weaknesses?.forEach((weakness, idx) => {
        console.log(`   ${idx + 1}. ${weakness}`);
      });
      
      // Skills Extraction
      console.log(`\n🎯 Extracted Skills (${data.analysis.keywords?.length || 0}):`);
      if (data.analysis.keywords?.length > 0) {
        console.log(`   Top Skills: ${data.analysis.keywords.slice(0, 8).join(', ')}`);
        if (data.analysis.keywords.length > 8) {
          console.log(`   Additional Skills: ${data.analysis.keywords.slice(8, 15).join(', ')}`);
        }
      } else {
        console.log('   ❌ No skills extracted - this indicates a problem');
      }
      
      // Career Paths Analysis
      console.log(`\n🚀 Career Path Suggestions (${data.analysis.career_paths?.length || 0}):`);
      data.analysis.career_paths?.forEach((path, idx) => {
        console.log(`   ${idx + 1}. ${path.title} (${path.match_percentage}% match)`);
        console.log(`      💡 ${path.why_fit?.substring(0, 80)}...`);
        if (path.existing_skills?.length > 0) {
          console.log(`      ✅ Your skills: ${path.existing_skills.slice(0, 3).join(', ')}`);
        }
        if (path.missing_skills?.length > 0) {
          console.log(`      📚 Skills to develop: ${path.missing_skills.slice(0, 3).join(', ')}`);
        }
      });
      
      // Job Recommendations
      console.log(`\n💼 Job Matches (${data.jobs?.length || 0}):`);
      data.jobs?.forEach((job, idx) => {
        console.log(`   ${idx + 1}. ${job.title} at ${job.company}`);
        console.log(`      📍 ${job.location} | Match: ${job.match_score}%`);
      });
      
      // Validation Checks
      console.log(`\n🔍 Validation Results:`);
      const validationResults = [];
      
      if (data.analysis.ats_score && data.analysis.ats_score !== 84) {
        validationResults.push('✅ ATS Score is dynamic (not using fallback)');
      } else {
        validationResults.push('⚠️  ATS Score may be using fallback value');
      }
      
      if (data.analysis.keywords?.length > 5) {
        validationResults.push('✅ Good skill extraction');
      } else {
        validationResults.push('❌ Poor skill extraction');
      }
      
      if (data.analysis.career_paths?.length >= 2) {
        validationResults.push('✅ Career paths generated');
      } else {
        validationResults.push('❌ Career paths missing');
      }
      
      if (data.jobs?.length >= 2) {
        validationResults.push('✅ Job recommendations generated');
      } else {
        validationResults.push('❌ Job recommendations missing');
      }
      
      validationResults.forEach(result => console.log(`   ${result}`));
      
    } else {
      console.log('❌ Analysis failed:', data.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(80));
}

async function runComprehensiveTest() {
  console.log('🔬 COMPREHENSIVE RESUME ANALYSIS TEST');
  console.log('Testing Enhanced Analysis with Resume Formats from Provided Images');
  console.log('=' .repeat(80));
  
  console.log('\n📋 Test Objectives:');
  console.log('• Verify improved ATS scoring based on actual content');
  console.log('• Validate enhanced skills extraction from all resume sections');
  console.log('• Confirm personalized career path suggestions');
  console.log('• Test different resume formats and experience levels');
  console.log('• Ensure no generic fallback responses');

  for (const resume of testResumes) {
    await testResumeAnalysis(resume);
    // Delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n📊 TEST SUMMARY');
  console.log('=' .repeat(80));
  console.log('Expected Results for Each Resume:');
  console.log('✓ Vara Prasad: High ATS score, AI/ML skills, junior developer paths');
  console.log('✓ Rahul Sharma: React/JS skills, frontend developer paths, mid-level roles');
  console.log('✓ Sarah Johnson: Marketing skills, management paths, senior-level positions');
  console.log('✓ Michael Chen: Advanced ML skills, data science paths, senior/lead roles');
  console.log('\nIf any resume shows generic responses, the enhancement needs refinement.');
}

runComprehensiveTest().catch(console.error);