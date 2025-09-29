// Test different resume types to verify fixes
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xwoeluhtkzednjetkgtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2VsdWh0a3plZG5qZXRrZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzYzMDQsImV4cCI6MjA3MjgxMjMwNH0.8HwgfaxrGEyPPNV90dwh64my9xzv-8Q4eFrJ7odySRY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test resumes with different skill sets
const testResumes = [
  {
    name: "Frontend Developer Resume",
    content: `Sarah Johnson
Frontend Developer

Contact: sarah@email.com | (555) 123-4567 | linkedin.com/in/sarah

EXPERIENCE:
• Frontend Developer at WebTech Solutions (2022-Present)
  - Built responsive websites using React, JavaScript, and CSS
  - Collaborated with UX designers on 15+ projects
  - Improved page load speed by 40% through optimization

• Junior Web Developer at StartupXYZ (2020-2022)
  - Created interactive user interfaces with HTML5, CSS3, JavaScript
  - Used Git for version control and collaborated via GitHub

EDUCATION:
Bachelor of Computer Science, State University (2016-2020)

SKILLS:
• Frontend: React, Vue.js, JavaScript, TypeScript, HTML5, CSS3
• Tools: Git, Webpack, NPM, Figma, Adobe Photoshop
• Soft Skills: Problem-solving, Team collaboration, Communication`
  },
  {
    name: "Data Analyst Resume", 
    content: `Michael Chen
Data Analyst

Contact: michael.chen@email.com | (555) 987-6543

PROFESSIONAL SUMMARY:
Results-driven Data Analyst with 4+ years of experience in data mining, 
statistical analysis, and business intelligence.

EXPERIENCE:
• Senior Data Analyst at DataCorp Inc. (2021-Present)
  - Analyzed large datasets using Python, SQL, and R
  - Created dashboards in Tableau and Power BI for executive reporting
  - Improved data processing efficiency by 35% through automation

• Business Analyst at FinanceFlow (2019-2021)
  - Performed statistical analysis on customer behavior data
  - Built predictive models using machine learning algorithms
  - Generated monthly reports for stakeholders

EDUCATION:
Master of Statistics, Data University (2017-2019)
Bachelor of Mathematics, Tech College (2013-2017)

TECHNICAL SKILLS:
• Programming: Python, R, SQL, Java
• Analytics: Tableau, Power BI, Excel, SPSS
• Database: MySQL, PostgreSQL, MongoDB
• Machine Learning: Scikit-learn, Pandas, NumPy`
  },
  {
    name: "Marketing Manager Resume",
    content: `Emma Rodriguez
Marketing Manager

Contact: emma.rodriguez@email.com | (555) 456-7890

PROFESSIONAL EXPERIENCE:
• Marketing Manager at BrandForce Agency (2020-Present)
  - Led digital marketing campaigns for 20+ clients
  - Managed social media accounts with 500K+ followers
  - Increased client ROI by average of 45% through targeted campaigns
  - Supervised team of 5 marketing specialists

• Digital Marketing Specialist at GrowthHub (2018-2020)
  - Developed content marketing strategies
  - Managed Google Ads and Facebook advertising campaigns
  - Created email marketing campaigns with 25% open rates

EDUCATION:
Bachelor of Business Administration - Marketing
Business University (2014-2018)

CORE COMPETENCIES:
• Digital Marketing: SEO, SEM, Social Media Marketing, Content Marketing
• Analytics: Google Analytics, Facebook Insights, Marketing Automation
• Design: Adobe Creative Suite, Canva, Video Editing
• Management: Team Leadership, Project Management, Budget Management
• Soft Skills: Creativity, Strategic Thinking, Communication, Problem-solving`
  }
];

async function testResumeAnalysis(resumeData) {
  console.log(`\n🧪 Testing: ${resumeData.name}`);
  console.log('=' .repeat(50));

  try {
    const blob = new Blob([resumeData.content], { type: 'text/plain' });
    const file = new File([blob], `${resumeData.name.replace(/\s+/g, '_')}.txt`, { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', `test-${Date.now()}`);

    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: formData,
    });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    if (data.success) {
      console.log('✅ Analysis Results:');
      console.log(`📊 ATS Score: ${data.analysis.ats_score}/100`);
      
      console.log(`🎯 Skills Extracted (${data.analysis.keywords?.length || 0}):`);
      console.log('  ', data.analysis.keywords?.slice(0, 5).join(', ') || 'None');
      
      console.log(`🚀 Career Paths (${data.analysis.career_paths?.length || 0}):`);
      data.analysis.career_paths?.slice(0, 2).forEach(path => {
        console.log(`   • ${path.title} (${path.match_percentage}% match)`);
      });
      
      console.log(`💼 Jobs Found (${data.jobs?.length || 0}):`);
      data.jobs?.slice(0, 3).forEach(job => {
        console.log(`   • ${job.title} at ${job.company} (${job.match_score}% match)`);
      });
      
    } else {
      console.log('❌ Analysis failed:', data.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🔬 Testing ATS Score Generation and Job Matching Fixes');
  console.log('Testing with different resume types to verify personalization...\n');

  for (const resume of testResumes) {
    await testResumeAnalysis(resume);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n📋 Test Summary:');
  console.log('Each resume should show:');
  console.log('✓ Different ATS scores based on content quality');
  console.log('✓ Skills relevant to that profession');
  console.log('✓ Career paths matching the background');
  console.log('✓ Jobs relevant to extracted skills');
  console.log('✓ NO duplicate/generic responses across different resumes');
}

runAllTests().catch(console.error);