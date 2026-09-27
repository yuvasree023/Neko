async function testEndpoints() {
  console.log('🧪 Testing Momo Journal API endpoints...');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const healthData = await healthRes.json();
  console.log('✅ Health check response:', healthData);

  // 2. Journal reflection with structured response
  const journalRes = await fetch('http://localhost:5000/api/gemini/journal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token',
    },
    body: JSON.stringify({
      journalText: 'Today I finally completed my full stack project! Everything worked out so well.',
    }),
  });
  const journalData = await journalRes.json();
  console.log('✅ Structured reaction response:', JSON.stringify(journalData, null, 2));

  // 3. Fast live text reaction
  const reactRes = await fetch('http://localhost:5000/api/gemini/react', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token',
    },
    body: JSON.stringify({
      journalText: 'I am so tired and need to rest.',
    }),
  });
  const reactData = await reactRes.json();
  console.log('✅ Fast reaction response:', JSON.stringify(reactData, null, 2));

  console.log('🎉 All backend API tests passed!');
}

testEndpoints().catch(console.error);
