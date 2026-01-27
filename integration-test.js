#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests the frontend-backend integration
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    if (!response.ok) {
      console.log(`   Error: ${data.error || 'Unknown error'}`);
    }
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Integration Tests...\n');
  
  // Test 1: Registration Data
  console.log('1. Testing Registration Data Endpoint');
  await testEndpoint('/elections/api/registration-data/');
  
  // Test 2: Candidates Endpoint (requires login)
  console.log('\n2. Testing Candidates Endpoint');
  await testEndpoint('/elections/api/candidates/');
  
  // Test 3: Parties Endpoint (requires login)
  console.log('\n3. Testing Parties Endpoint');
  await testEndpoint('/elections/api/parties/');
  
  // Test 4: Voter Registration
  console.log('\n4. Testing Voter Registration');
  await testEndpoint('/elections/api/voter/register/', 'POST', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!',
    province_name: 'Bagmati',
    district_name: 'Kathmandu',
    electoral_area_name: 'Kathmandu-1'
  });
  
  // Test 5: Voter Login
  console.log('\n5. Testing Voter Login');
  await testEndpoint('/elections/api/voter/login/', 'POST', {
    email: 'test@example.com',
    password: 'TestPass123!'
  });
  
  console.log('\n✨ Integration tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Start your Django backend: python manage.py runserver');
  console.log('2. Start your React frontend: npm run dev');
  console.log('3. Test the full registration and voting flow');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}