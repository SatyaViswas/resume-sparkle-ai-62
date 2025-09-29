// Test Data Analyst resume specifically
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xwoeluhtkzednjetkgtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2VsdWh0a3plZG5qZXRrZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzYzMDQsImV4cCI6MjA3MjgxMjMwNH0.8HwgfaxrGEyPPNV90dwh64my9xzv-8Q4eFrJ7odySRY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDataAnalystResume() {
  console.log('🧪 Testing Data Analyst Resume for Job Generation...\n');

  const dataAnalystResume = `Michael Chen
Data Analyst

Experience: 4 years in data analysis
Skills: Python, SQL, Tableau, Power BI, Excel, Machine Learning
Education: Master's in Statistics

Projects:
- Built predictive models using Python and scikit-learn
- Created dashboards in Tableau for executive reporting
- Analyzed customer data using SQL and Excel`;

  try {
    const blob = new Blob([dataAnalystResume], { type: 'text/plain' });
    const file = new File([blob], 'data-analyst-resume.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'test-data-analyst');

    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: formData,
    });

    if (data.success) {
      console.log('📊 Skills Extracted:', data.analysis.keywords?.slice(0, 5));
      console.log('\n💼 Jobs Generated:');
      data.jobs?.forEach(job => {
        console.log(`• ${job.title} at ${job.company} (${job.match_score}% match)`);
        console.log(`  Location: ${job.location}`);
        console.log(`  Description: ${job.description.substring(0, 100)}...\n`);
      });
    } else {
      console.log('❌ Test failed:', data.error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testDataAnalystResume();