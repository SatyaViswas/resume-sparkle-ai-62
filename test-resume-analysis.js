// Test script to check resume analysis function
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://xwoeluhtkzednjetkgtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2VsdWh0a3plZG5qZXRrZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzYzMDQsImV4cCI6MjA3MjgxMjMwNH0.8HwgfaxrGEyPPNV90dwh64my9xzv-8Q4eFrJ7odySRY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testResumeAnalysis() {
  console.log('Testing resume analysis...');
  
  try {
    // Create a simple test text file to simulate resume upload
    const testResumeContent = `
    John Doe
    Software Engineer
    
    Experience:
    - Software Developer at TechCorp (2020-2023)
    - Developed web applications using React, JavaScript, Node.js
    - Led a team of 3 developers on multiple projects
    - Improved application performance by 40%
    
    Education:
    - Bachelor's in Computer Science, University of Technology (2016-2020)
    
    Skills:
    - Programming: JavaScript, Python, React, Node.js
    - Database: MySQL, MongoDB
    - Tools: Git, Docker, AWS
    - Soft Skills: Leadership, Communication, Problem-solving
    
    Projects:
    - E-commerce Platform: Built a full-stack e-commerce solution
    - Data Analytics Dashboard: Created real-time analytics dashboard
    `;
    
    const blob = new Blob([testResumeContent], { type: 'text/plain' });
    const file = new File([blob], 'test-resume.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'test-user-id');
    
    console.log('Calling analyze-resume function...');
    
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: formData,
    });
    
    if (error) {
      console.error('Function error:', error);
      return;
    }
    
    console.log('Function response:', data);
    
    if (data.success) {
      console.log('✅ Resume analysis successful!');
      console.log('📊 Analysis results:', {
        ats_score: data.analysis?.ats_score,
        strengths_count: data.analysis?.strengths?.length || 0,
        weaknesses_count: data.analysis?.weaknesses?.length || 0,
        career_paths_count: data.analysis?.career_paths?.length || 0,
        keywords_count: data.analysis?.keywords?.length || 0,
        jobs_count: data.jobs?.length || 0
      });
      
      console.log('🎯 Career paths suggested:');
      data.analysis?.career_paths?.forEach((path, i) => {
        console.log(`  ${i+1}. ${path.title} (${path.match_percentage}% match)`);
      });
      
    } else {
      console.error('❌ Resume analysis failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testResumeAnalysis();