const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { geminiClient } = require('./src/integrations/gemini/gemini.client');

async function checkAI() {
  console.log('--- Hajo AI Connectivity Test ---');
  console.log('Checking GOOGLE_API_KEY...');
  
  if (!process.env.GOOGLE_API_KEY) {
    console.log('❌ Error: GOOGLE_API_KEY is missing from your backend/.env file.');
    console.log('ℹ️ Status: AI will run in OFFLINE FALLBACK mode during the demo.');
    return;
  }

  console.log('Attempting to contact Gemini API...');
  try {
    const result = await geminiClient.generateQuotation({ 
      serviceType: 'Plumbing Repair',
      description: 'Test connection for hackathon demo',
      location: 'Lagos',
      budgetRange: '10,000 - 15,000'
    });
    
    console.log('✅ Success: AI IS ONLINE');
    console.log('Sample Quotation Generated:');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.log('❌ Error: Could not connect to Gemini API.');
    console.log('Message:', err.message);
    console.log('ℹ️ Status: System will use deterministic fallbacks.');
  }
}

checkAI();
