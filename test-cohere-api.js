// Test script to verify Cohere API key is working
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xwoeluhtkzednjetkgtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2VsdWh0a3plZG5qZXRrZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzYzMDQsImV4cCI6MjA3MjgxMjMwNH0.8HwgfaxrGEyPPNV90dwh64my9xzv-8Q4eFrJ7odySRY";

async function testCohereAPIKey() {
  console.log('🧪 Testing Cohere API key validity...\n');

  try {
    // Create a test edge function call to check API key
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Create a simple test content
    const testContent = `John Doe
Software Engineer
Experience: 3 years in web development
Skills: JavaScript, React, Node.js
Education: Computer Science degree`;

    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('userId', 'test-cohere-validation');

    console.log('📡 Calling analyze-resume function...');
    
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: formData
    });

    if (error) {
      console.error('❌ Function invocation error:', error);
      return false;
    }

    console.log('📋 Function response:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ SUCCESS: Cohere API is working!');
      console.log('📊 Analysis results:', {
        ats_score: data.analysis?.ats_score,
        strengths_count: data.analysis?.strengths?.length || 0,
        career_paths_count: data.analysis?.career_paths?.length || 0
      });
      return true;
    } else {
      console.log('\n❌ FAILURE: Resume analysis failed');
      console.log('🔍 Error:', data.error);
      
      // Check if it's a Cohere API key issue
      if (data.error && data.error.includes('Cohere')) {
        console.log('\n🔑 ISSUE: Cohere API key appears to be invalid or expired');
        return false;
      }
      
      return false;
    }

  } catch (error) {
    console.error('\n💥 TEST FAILED:', error.message);
    return false;
  }
}

// Run the test
testCohereAPIKey()
  .then(success => {
    if (success) {
      console.log('\n🎉 Your Cohere API integration is working correctly!');
      console.log('The issue might be elsewhere in the frontend or processing flow.');
    } else {
      console.log('\n⚠️  Your Cohere API key needs to be updated or there\'s a configuration issue.');
      console.log('You should get a new API key from https://dashboard.cohere.ai/');
    }
  })
  .catch(console.error);