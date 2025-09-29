// Direct test of Cohere API to check if the key is valid
async function testCohereDirectly() {
  console.log('🔑 Testing Cohere API key directly...\n');

  // Test prompt
  const testPrompt = `Analyze this resume and provide feedback in JSON format:
  
{
  "ats_score": 75,
  "strengths": ["Good experience section", "Clear skills listed"],
  "weaknesses": ["Missing contact info", "Could use more metrics"],
  "improvements": ["Add quantifiable achievements", "Include relevant keywords"]
}

Resume: John Doe, Software Engineer with 3 years experience in JavaScript and React.`;

  try {
    // You'll need to replace this with a real Cohere API key
    const cohereApiKey = 'YOUR_COHERE_API_KEY_HERE'; // Replace with actual key
    
    console.log('📡 Making direct call to Cohere API...');
    
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
      console.log('❌ Error response:', errorBody);
      
      if (response.status === 401) {
        console.log('\n🔑 ISSUE: Invalid or expired Cohere API key');
        console.log('Please get a new API key from: https://dashboard.cohere.ai/');
        return false;
      }
      
      return false;
    }

    const data = await response.json();
    console.log('✅ Cohere API response:', JSON.stringify(data, null, 2));
    
    if (data.text) {
      console.log('\n🎉 SUCCESS: Cohere API key is working!');
      console.log('📝 Response text preview:', data.text.substring(0, 200) + '...');
      return true;
    }
    
    return false;

  } catch (error) {
    console.error('💥 Error:', error.message);
    return false;
  }
}

console.log('⚠️  IMPORTANT: You need to replace YOUR_COHERE_API_KEY_HERE with your actual Cohere API key');
console.log('Get your API key from: https://dashboard.cohere.ai/\n');

// Uncomment the line below after adding your API key
// testCohereDirectly();