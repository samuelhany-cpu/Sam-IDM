// Test Script for Browser Integration HTTP Server
// Run this after starting Sam with "npm run dev"

const http = require('http');

console.log('🧪 Testing Sam Download Manager Browser Integration Server\n');

function testEndpoint(endpoint, data, description) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 8765,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`Testing: ${description}`);
    console.log(`Endpoint: POST http://localhost:8765${endpoint}`);
    console.log(`Data: ${postData}\n`);

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${responseData}`);
        console.log('---\n');
        resolve({ status: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error: ${error.message}`);
      console.log('---\n');
      resolve({ error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Make sure Sam is running (npm run dev) before running these tests!\n');
  console.log('Press Ctrl+C to stop\n');
  console.log('='.repeat(70));
  console.log('\n');

  // Test 1: Add download with small file
  await new Promise(resolve => setTimeout(resolve, 1000));
  await testEndpoint(
    '/add-download',
    {
      url: 'https://speed.hetzner.de/100MB.bin',
      filename: 'test-100mb.bin',
      referrer: 'https://test-script.local'
    },
    'Add Download - Small Test File'
  );

  // Wait for user to interact with dialog
  console.log('⏳ Waiting 5 seconds for you to respond to the dialog...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test 2: Add download with JSON file
  await testEndpoint(
    '/add-download',
    {
      url: 'https://jsonplaceholder.typicode.com/posts',
      filename: 'posts.json',
      referrer: 'https://test-script.local'
    },
    'Add Download - JSON API Response'
  );

  console.log('⏳ Waiting 5 seconds for dialog...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test 3: Open app (no dialog)
  await testEndpoint(
    '/open-app',
    {},
    'Open App - Should just show window'
  );

  // Test 4: Invalid endpoint
  await testEndpoint(
    '/invalid-endpoint',
    {},
    'Invalid Endpoint - Should return 404'
  );

  console.log('='.repeat(70));
  console.log('\n✅ All tests completed!');
  console.log('\nExpected Results:');
  console.log('1. Tests 1 & 2: Sam window appeared with dialog');
  console.log('2. Test 3: Sam window came to front (no dialog)');
  console.log('3. Test 4: 404 error response');
  console.log('\nIf all worked correctly, browser integration is functioning! 🎉');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
