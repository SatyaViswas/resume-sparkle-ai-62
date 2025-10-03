// Debug single resume analysis to see what's happening
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xwoeluhtkzednjetkgtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2VsdWh0a3plZG5qZXRrZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzYzMDQsImV4cCI6MjA3MjgxMjMwNH0.8HwgfaxrGEyPPNV90dwh64my9xzv-8Q4eFrJ7odySRY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test one resume that should have good skills
const testResume = `Sarah Johnson
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
• Mentored 3 junior marketers, with 2 receiving internal promotions`;

async function debugResumeAnalysis() {
  console.log('🔍 DEBUGGING SINGLE RESUME ANALYSIS');
  console.log('Testing Sarah Johnson Marketing Manager Resume');
  console.log('=' .repeat(60));

  try {
    const blob = new Blob([testResume], { type: 'text/plain' });
    const file = new File([blob], 'sarah_johnson_marketing_manager.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', `debug-${Date.now()}`);

    console.log('📤 Sending resume for analysis...');
    console.log('📝 Resume length:', testResume.length, 'characters');
    console.log('📝 Contains skills section:', testResume.includes('CORE COMPETENCIES'));
    console.log('📝 Contains experience section:', testResume.includes('PROFESSIONAL EXPERIENCE'));

    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: formData,
    });

    if (error) {
      console.error('❌ Function Error:', JSON.stringify(error, null, 2));
      return;
    }

    console.log('\n📊 Raw Response Data:');
    console.log('Success:', data.success);
    console.log('Error:', data.error);
    
    if (data.success) {
      console.log('\n✅ Analysis Details:');
      console.log('ATS Score:', data.analysis?.ats_score);
      console.log('Strengths count:', data.analysis?.strengths?.length);
      console.log('Skills/Keywords count:', data.analysis?.keywords?.length);
      console.log('Career paths count:', data.analysis?.career_paths?.length);
      console.log('Jobs count:', data.jobs?.length);
      
      console.log('\n📈 Extracted Skills:');
      if (data.analysis?.keywords) {
        console.log(data.analysis.keywords.slice(0, 10));
      } else {
        console.log('No skills/keywords found');
      }
      
      console.log('\n🎯 Career Paths:');
      if (data.analysis?.career_paths) {
        data.analysis.career_paths.forEach((path, idx) => {
          console.log(`${idx + 1}. ${path.title} (${path.match_percentage}% match)`);
        });
      } else {
        console.log('No career paths found');
      }
      
      console.log('\n💼 Job Recommendations:');
      if (data.jobs) {
        data.jobs.forEach((job, idx) => {
          console.log(`${idx + 1}. ${job.title} at ${job.company} (${job.match_score}% match)`);
        });
      } else {
        console.log('No job recommendations found');
      }

    } else {
      console.log('❌ Analysis failed:', data.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugResumeAnalysis().catch(console.error);