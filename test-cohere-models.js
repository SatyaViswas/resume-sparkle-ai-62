// Test current available Cohere models
async function testCohereModels() {
  console.log('🔍 Testing available Cohere models...\n');

  const cohereApiKey = '5GMOObCKEzdtZIjTzVxkEAqS7FpOn9ohtRvOEUQn';
  const testPrompt = 'Hello, please respond with "Model working" if you receive this message.';

  const modelsToTest = [
    'command-r',
    'command',
    'command-nightly',
    'command-light',
    'command-light-nightly'
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`🧪 Testing model: ${model}...`);
      
      const response = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          message: testPrompt,
          temperature: 0.3,
        }),
      });

      console.log(`  Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ SUCCESS! Model ${model} is working`);
        console.log(`  Response: ${data.text?.substring(0, 50)}...`);
        return model; // Return the first working model
      } else {
        const errorBody = await response.text();
        console.log(`  ❌ Failed: ${errorBody.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`  💥 Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  return null;
}

testCohereModels()
  .then(workingModel => {
    if (workingModel) {
      console.log(`\n🎉 Found working model: ${workingModel}`);
      console.log('I will update your functions to use this model.');
    } else {
      console.log('\n❌ No working models found.');
      console.log('Please check your Cohere account status.');
    }
  })
  .catch(console.error);