/**
 * Test Script: Create test users and simulate voting
 * This script creates 6 test users from different provinces and has them vote
 */

const API_BASE_URL = "http://127.0.0.1:8000";

// Test users from different provinces
const testUsers = [
  {
    email: "ram.koshi@test.com",
    password: "Test123!",
    first_name: "Ram",
    last_name: "Shrestha",
    phone: "9841234567",
    date_of_birth: "1990-05-15",
    province: "Province 1",
    district: "Jhapa",
    electoral_area: "Jhapa-1",
    voter_id: "KOS001"
  },
  {
    email: "sita.madhesh@test.com", 
    password: "Test123!",
    first_name: "Sita",
    last_name: "Yadav",
    phone: "9841234568",
    date_of_birth: "1985-08-20",
    province: "Province 2",
    district: "Saptari",
    electoral_area: "Saptari-1",
    voter_id: "MAD001"
  },
  {
    email: "hari.bagmati@test.com",
    password: "Test123!",
    first_name: "Hari",
    last_name: "Tamang",
    phone: "9841234569",
    date_of_birth: "1988-12-10",
    province: "Province 3",
    district: "Kathmandu",
    electoral_area: "Kathmandu-1",
    voter_id: "BAG001"
  },
  {
    email: "gita.gandaki@test.com",
    password: "Test123!",
    first_name: "Gita",
    last_name: "Gurung",
    phone: "9841234570",
    date_of_birth: "1992-03-25",
    province: "Province 4",
    district: "Kaski",
    electoral_area: "Kaski-1",
    voter_id: "GAN001"
  },
  {
    email: "krishna.lumbini@test.com",
    password: "Test123!",
    first_name: "Krishna",
    last_name: "Thapa",
    phone: "9841234571",
    date_of_birth: "1987-07-18",
    province: "Province 5",
    district: "Rupandehi",
    electoral_area: "Rupandehi-1",
    voter_id: "LUM001"
  },
  {
    email: "maya.karnali@test.com",
    password: "Test123!",
    first_name: "Maya",
    last_name: "Budha",
    phone: "9841234572",
    date_of_birth: "1991-11-05",
    province: "Province 6",
    district: "Surkhet",
    electoral_area: "Surkhet-1",
    voter_id: "KAR001"
  }
];

// Vote choices for each user (different candidates and parties)
const voteChoices = [
  { candidateId: 1, partyId: 1 }, // Ram votes for candidate 1, party 1
  { candidateId: 2, partyId: 2 }, // Sita votes for candidate 2, party 2
  { candidateId: 3, partyId: 1 }, // Hari votes for candidate 3, party 1
  { candidateId: 1, partyId: 3 }, // Gita votes for candidate 1, party 3
  { candidateId: 4, partyId: 2 }, // Krishna votes for candidate 4, party 2
  { candidateId: 2, partyId: 3 }  // Maya votes for candidate 2, party 3
];

/**
 * Make API request with proper headers
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
}

/**
 * Register a test user
 */
async function registerUser(userData) {
  try {
    console.log(`Registering user: ${userData.email}`);
    const response = await apiRequest("/elections/api/voter/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    console.log(`✅ User ${userData.email} registered successfully`);
    return response;
  } catch (error) {
    console.log(`❌ Failed to register ${userData.email}: ${error.message}`);
    return null;
  }
}

/**
 * Login user
 */
async function loginUser(email, password) {
  try {
    console.log(`Logging in user: ${email}`);
    const response = await apiRequest("/elections/api/voter/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    console.log(`✅ User ${email} logged in successfully`);
    return response;
  } catch (error) {
    console.log(`❌ Failed to login ${email}: ${error.message}`);
    return null;
  }
}

/**
 * Submit vote
 */
async function submitVote(userEmail, voteType, candidateId = null, partyId = null) {
  try {
    const payload = {
      vote_type: voteType,
      user_email: userEmail,
    };
    
    if (candidateId) payload.candidate_id = candidateId;
    if (partyId) payload.party_id = partyId;
    
    console.log(`Submitting ${voteType} vote for ${userEmail}:`, payload);
    
    const response = await apiRequest("/elections/vote/submit/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    console.log(`✅ ${voteType} vote submitted for ${userEmail}`);
    return response;
  } catch (error) {
    console.log(`❌ Failed to submit ${voteType} vote for ${userEmail}: ${error.message}`);
    return null;
  }
}

/**
 * Check voting history
 */
async function checkVotingHistory(userEmail) {
  try {
    const response = await apiRequest(`/elections/api/voting-history?user_email=${encodeURIComponent(userEmail)}`, {
      method: "GET",
    });
    console.log(`📊 Voting history for ${userEmail}:`, response);
    return response;
  } catch (error) {
    console.log(`❌ Failed to get voting history for ${userEmail}: ${error.message}`);
    return null;
  }
}

/**
 * Main test function
 */
async function runVotingTest() {
  console.log("🚀 Starting voting test with 6 users from different provinces...\n");
  
  // Step 1: Register all users
  console.log("📝 STEP 1: Registering users...");
  for (const user of testUsers) {
    await registerUser(user);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  console.log("\n⏳ Waiting 2 seconds before login...\n");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Step 2: Login and vote for each user
  console.log("🗳️ STEP 2: Login and voting...");
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    const votes = voteChoices[i];
    
    console.log(`\n--- Processing user ${i + 1}: ${user.email} ---`);
    
    // Login
    const loginResult = await loginUser(user.email, user.password);
    if (!loginResult) continue;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Submit FPTP vote (candidate)
    await submitVote(user.email, 'FPTP', votes.candidateId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Submit PR vote (party)
    await submitVote(user.email, 'PR', null, votes.partyId);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n⏳ Waiting 2 seconds before checking results...\n");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Step 3: Check voting history for all users
  console.log("📊 STEP 3: Checking voting history...");
  for (const user of testUsers) {
    console.log(`\n--- Voting history for ${user.email} ---`);
    await checkVotingHistory(user.email);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n✅ Voting test completed!");
  console.log("\n🔍 Please check your backend database tables:");
  console.log("- fptp_votes table for candidate votes");
  console.log("- pr_votes table for party votes");
  console.log("- vote_legacy table for consolidated votes");
}

// Run the test
runVotingTest().catch(console.error);