// Direct test of your Cohere API key
async function testCohereDirectly() {
  console.log('🔑 Testing your Cohere API key directly...\n');

  const cohereApiKey = '5GMOObCKEzdtZIjTzVxkEAqS7FpOn9ohtRvOEUQn';
  const testPrompt = `Analyze this resume and provide feedback in JSON format:

{
  "ats_score": 85,
  "strengths": ["Good technical skills", "Clear experience"],
  "weaknesses": ["Missing contact info", "Could use metrics"],
  "improvements": ["Add achievements", "Include keywords"]
}

Resume: John Doe, Software Engineer with 5 years experience in React, Node.js, and Python. Led team of 3 developers. Built e-commerce platform serving 100K users.`;

  try {
    console.log('📡 Making direct call to Cohere API...');
    console.log('🔑 Using API key:', cohereApiKey.substring(0, 8) + '...');
    
    const response = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: testPrompt,
        temperature: 0.3,
      }),
    });

    console.log('📊 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log('❌ Error response body:', errorBody);
      
      if (response.status === 401) {
        console.log('\n🔑 DIAGNOSIS: API key is invalid or unauthorized');
        console.log('Solutions:');
        console.log('1. Check if your Cohere account is verified');
        console.log('2. Check if you have API usage permissions');
        console.log('3. Try regenerating the API key');
      } else if (response.status === 429) {
        console.log('\n⏰ DIAGNOSIS: Rate limited or quota exceeded');
        console.log('Solutions:');
        console.log('1. Wait a few minutes and try again');
        console.log('2. Check your Cohere account usage/billing');
      } else {
        console.log('\n❌ DIAGNOSIS: Other API error');
        console.log('Check Cohere documentation for status code:', response.status);
      }
      
      return false;
    }

    const data = await response.json();
    console.log('✅ SUCCESS! Cohere API response:');
    console.log('📝 Response preview:', data.text?.substring(0, 200) + '...');
    
    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(data.text);
      console.log('\n🎯 Parsed analysis:');
      console.log('- ATS Score:', parsedResponse.ats_score);
      console.log('- Strengths:', parsedResponse.strengths?.length || 0);
      console.log('- Weaknesses:', parsedResponse.weaknesses?.length || 0);
    } catch (e) {
      console.log('\n📝 Response is not JSON format (might need parsing)');
    }
    
    return true;

  } catch (error) {
    console.error('💥 Network/Connection Error:', error.message);
    console.log('\n🔍 Possible causes:');
    console.log('1. Internet connection issues');
    console.log('2. Firewall blocking the request');
    console.log('3. Cohere API endpoint temporarily unavailable');
    return false;
  }
}

console.log('🧪 Testing your actual Cohere API key...\n');
testCohereDirectly()
  .then(success => {
    if (success) {
      console.log('\n🎉 Your Cohere API key is working perfectly!');
      console.log('The issue might be in the Supabase function configuration.');
    } else {
      console.log('\n⚠️ There\'s an issue with the Cohere API key or account.');
      console.log('Please check your Cohere dashboard for any notices.');
    }
  })
  .catch(console.error);