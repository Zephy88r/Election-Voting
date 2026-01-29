import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Language Context for EN/NP Translation
 * Provides translation strings and language switching functionality
 */

const translations = {
  EN: {
    // Navbar
    appName: 'Nepal Voting System',
    profile: 'Profile',
    
    // Dashboard
    welcome: 'Welcome',
    selectProvince: 'Select Your Province to Vote',
    provinceVoting: 'Province Voting',
    districtVoting: 'District Voting',
    votingHistory: 'Voting History',
    pleaseSignIn: 'Please sign in to access province voting pages',
    accessDenied: 'Access Denied: You can only vote in {provinceName}',
    welcomeBack: 'Welcome back, {name}',
    registeredIn: 'You are registered in',
    selectProvinceToViewVoting: 'Select your province to view voting information',
    nepalElectionVotingSystem: 'Nepal Election Voting System',
    pleaseSignInToAccess: 'Please sign in to access your province voting page',
    selectYourProvince: 'Select Your Province',
    navigateTo: 'Navigate to',
    province: 'Province',
    accessRestricted: 'Access Restricted',
    yourProvince: 'Your Province',

    // Province Template
    provincialBallot: 'Provincial Ballot',
    selectParty: 'Select exactly one party. Your choice is final.',
    prVote: 'PR Vote',
    alreadyVoted: 'Already Voted',
    notVotedYet: 'Not Voted Yet',
    howItWorks: 'How it works',
    status: 'Status',
    vote: 'Vote',
    voted: 'Voted',
    locked: 'Locked',
    back: 'Back',
    continueToDistrict: 'Continue to District Voting',
    
    // District Page
    districtBallot: 'District Ballot',
    selectDistrict: 'Select Your District',
    selectElectoralArea: 'Select Electoral Area',
    fptpVote: 'FPTP Vote',
    district: 'District',
    electoralArea: 'Electoral Area',
    selectCandidate: 'Select exactly one candidate from your electoral area.',
    candidates: 'Candidates',
    candidate: 'Candidate',
    party: 'Party',
    independent: 'Independent',
    
    // Electoral Modal
    selectYourElectoralArea: 'Select Your Electoral Area',
    chooseElectoralArea: 'Choose the electoral area where you are registered to vote.',
    availableAreas: 'Available Electoral Areas',
    restrictedArea: 'You can only vote in your registered electoral area',
    select: 'Select',
    cancel: 'Cancel',
    pleaseSelectPartyAndCandidate: 'Please select a party and a candidate',
    voteFailed: 'Vote failed: {error}',
    castYourVote: 'Cast Your Vote',
    parties: 'Parties',
    submitVote: 'Submit Vote',
    voteCastedSuccessfully: 'Vote Casted Successfully',
    close: 'Close',
    
    // Voting
    confirmVote: 'Confirm your vote',
    confirmMessage: 'You are about to cast your vote. This action cannot be undone.',
    selectedParty: 'Selected Party',
    selectedCandidate: 'Selected Candidate',
    yesCastVote: 'Yes, Cast Vote',
    voteSubmitted: 'Vote Submitted',
    voteSuccess: 'Your vote has been recorded successfully.',
    alreadyVotedError: 'You have already voted in this category.',
    
    // Access Control
    onlyVoteInRegistered: 'You can only vote in',
    yourRegisteredProvince: 'your registered province',
    yourRegisteredDistrict: 'your registered district',
    yourRegisteredElectoralArea: 'your registered electoral area',
    backToDashboard: 'Back to Dashboard',
    
    // Loading
    loading: 'Loading...',
    preparingBallot: 'Preparing ballot...',
    submitting: 'Submitting...',
    
    // Profile
    yourProfile: 'Your Profile',
    name: 'Name',
    email: 'Email',
    username: 'Username',
    registeredProvince: 'Registered Province',
    registeredDistrict: 'Registered District',
    registeredElectoralArea: 'Registered Electoral Area',
    
    // Login & Register
    pleaseEnterDetails: 'Please enter your details to continue',
    password: 'Password',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    stayLoggedIn: 'Stay logged in on this Device',
    forgotPassword: 'Forgot Password?',
    forgotPasswordSoon: 'Forgot password functionality coming soon!',
    loggingIn: 'Logging in...',
    logIn: 'Log In',
    newUser: 'New User?',
    registerHere: 'Register Here',
    fixFormErrors: 'Please fix the errors in the form',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    
    // Register Form
    fullName: 'Full Name',
    enterFullName: 'Enter your full name',
    phoneNumber: 'Phone Number',
    nepalPhoneFormat: 'Nepal format: +977 XXX-XXXXXXX',
    selectProvince: 'Select your province',
    selectDistrict: 'Select your district',
    selectDistrictFirst: 'Select district first',
    enterVoterId: 'Enter your voter ID',
    enterCitizenshipNumber: 'Enter your citizenship number',
    passwordRequirements: 'Must contain uppercase, lowercase, and special characters',
    confirmPassword: 'Confirm Password',
    confirmYourPassword: 'Confirm your password',
    registering: 'Registering...',
    register: 'Register',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    bsDate: 'BS',
    selectBSDate: 'Select BS date',
    mustBe18Plus: 'You must be 18+ years old to register',
    
    // Profile Page
    userProfile: 'User Profile',
    editAccountInfo: 'Edit your account information',
    yourAccountInfo: 'Your account information',
    noPhoto: 'No Photo',
    changePhoto: 'Change Photo',
    uploadPhoto: 'Upload Photo',
    fullName: 'Full Name',
    phone: 'Phone',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    citizenshipNumber: 'Citizenship Number',
    voterId: 'Voter ID',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    logout: 'Logout',
    profileUpdated: 'Profile updated successfully!',
    loadingProfile: 'Loading profile...',
    userNotFound: 'User not found. Please log in again.',
    goToLogin: 'Go to Login',
    selectValidImage: 'Please select a valid image file',
    imageSizeLimit: 'Image size must be less than 5MB',
    failedToReadImage: 'Failed to read image file',
    failedToUpdateProfile: 'Failed to update profile. Please try again.',
    
    // Messages
    tip: 'Tip: Double-check your choice. After submitting, you cannot vote again.',
    votedFor: 'Voted for',
    notVoted: 'You have not voted yet.',
    voteInstructions: 'Choose a party and submit your vote. The system enforces one (1) party vote only. This ballot is for proportional representation voting.',
    
    // Footer
    footerTitle: 'Nepal Election System',
    footerTagline: 'Democratic • Transparent • Secure',
    footerProvinces: 'Provinces',
    footerDistricts: 'Districts',
    footerCopyright: 'Nepal Election Commission',
    
    // Province Names
    provinces: {
      koshi: 'Koshi Province',
      madhesh: 'Madhesh Province', 
      bagmati: 'Bagmati Province',
      gandaki: 'Gandaki Province',
      lumbini: 'Lumbini Province',
      karnali: 'Karnali Province',
      sudurpaschim: 'Sudurpashchim Province'
    },

    // Validation Messages
    validation: {
      provinceRequired: 'Province selection is required',
      districtRequired: 'District is required',
      electoralAreaRequired: 'Electoral area is required',
      dateOfBirthRequired: 'Date of Birth is required',
      fixFormErrors: 'Please fix the errors in the form',
      invalidDateOfBirth: 'Invalid date of birth. Please check the date and try again.',
      accessRestricted: 'Access Restricted',
      signInRequired: 'Sign in required',
      hidePassword: 'Hide password',
      showPassword: 'Show password'
    },

    // Common
    common: {
      loading: 'Loading...',
      cancel: 'Cancel',
      backToDashboard: 'Back to Dashboard',
      accessDenied: 'Access Denied'
    },

    // Voting
    voting: {
      votingTitle: 'Voting',
      candidateVote: 'Candidate Vote (FPTP)',
      partyVote: 'Party Vote (PR)',
      complete: 'Complete',
      step1Title: 'Step 1: Select Your Candidate (FPTP)',
      step1Description: 'Choose one candidate to represent your constituency',
      step2Title: 'Step 2: Select Your Party (PR)',
      step2Description: 'Choose one party for proportional representation',
      alreadyVotedParty: 'You have already voted for:',
      continueToPartyVote: 'Continue to Party Vote →',
      backToCandidateVote: '← Back to Candidate Vote',
      reviewVotes: 'Review Votes →',
      reviewTitle: 'Review Your Votes',
      reviewDescription: 'Please review your selections before finalizing.',
      fptpVote: 'FPTP Vote',
      prVote: 'PR Vote',
      notVoted: 'Not voted',
      backToPartyVote: '← Back to Party Vote',
      completeAndDashboard: 'Complete & Go to Dashboard',
      accessDeniedMessage: 'You can only vote in your registered province:',
      confirmFPTPTitle: 'Confirm FPTP Vote',
      confirmFPTPMessage: 'You can vote only once for a candidate.',
      selectedCandidate: 'Selected Candidate',
      confirmPRTitle: 'Confirm PR Vote',
      confirmPRMessage: 'You can vote only once for a party.',
      selectedParty: 'Selected Party',
      yesCastVote: 'Yes, Cast Vote',
      confirmFinalTitle: 'Confirm Your Final Votes',
      confirmFinalMessage: 'Please confirm your final vote selections. This action cannot be undone.',
      confirmFinalVotes: 'Confirm Final Votes',
      voteConfirmed: 'You have voted for:'
    },

    // Districts
    districts: {
      'Bhojpur': 'Bhojpur', 'Dhankuta': 'Dhankuta', 'Ilam': 'Ilam', 'Jhapa': 'Jhapa', 'Khotang': 'Khotang',
      'Morang': 'Morang', 'Okhaldhunga': 'Okhaldhunga', 'Panchthar': 'Panchthar', 'Sankhuwasabha': 'Sankhuwasabha',
      'Solukhumbu': 'Solukhumbu', 'Sunsari': 'Sunsari', 'Taplejung': 'Taplejung', 'Terhathum': 'Terhathum',
      'Udayapur': 'Udayapur', 'Bara': 'Bara', 'Dhanusa': 'Dhanusa', 'Mahottari': 'Mahottari', 'Parsa': 'Parsa',
      'Rautahat': 'Rautahat', 'Saptari': 'Saptari', 'Sarlahi': 'Sarlahi', 'Siraha': 'Siraha', 'Bhaktapur': 'Bhaktapur',
      'Chitwan': 'Chitwan', 'Dhading': 'Dhading', 'Dolakha': 'Dolakha', 'Kavrepalanchok': 'Kavrepalanchok',
      'Kathmandu': 'Kathmandu', 'Lalitpur': 'Lalitpur', 'Makwanpur': 'Makwanpur', 'Nuwakot': 'Nuwakot',
      'Ramechhap': 'Ramechhap', 'Rasuwa': 'Rasuwa', 'Sindhuli': 'Sindhuli', 'Sindhupalchok': 'Sindhupalchok',
      'Baglung': 'Baglung', 'Gorkha': 'Gorkha', 'Kaski': 'Kaski', 'Lamjung': 'Lamjung', 'Manang': 'Manang',
      'Mustang': 'Mustang', 'Myagdi': 'Myagdi', 'Nawalpur': 'Nawalpur', 'Parbat': 'Parbat', 'Syangja': 'Syangja',
      'Tanahun': 'Tanahun', 'Arghakhanchi': 'Arghakhanchi', 'Banke': 'Banke', 'Bardiya': 'Bardiya', 'Dang': 'Dang',
      'Gulmi': 'Gulmi', 'Kapilvastu': 'Kapilvastu', 'Nawalparasi West': 'Nawalparasi West', 'Palpa': 'Palpa', 'Pyuthan': 'Pyuthan', 'Rolpa': 'Rolpa',
      'Rupandehi': 'Rupandehi', 'Dailekh': 'Dailekh', 'Dolpa': 'Dolpa', 'Humla': 'Humla',
      'Jumla': 'Jumla', 'Kalikot': 'Kalikot', 'Mugu': 'Mugu', 'Rukum West': 'Rukum West',
      'Salyan': 'Salyan', 'Surkhet': 'Surkhet', 'Achham': 'Achham', 'Baitadi': 'Baitadi', 'Bajhang': 'Bajhang',
      'Bajura': 'Bajura', 'Baitadi': 'Baitadi', 'Dadeldhura': 'Dadeldhura', 'Darchula': 'Darchula', 'Doti': 'Doti', 'Kailali': 'Kailali',
      'Kanchanpur': 'Kanchanpur'
    },

    // Areas (for electoral areas display)
    areas: {
      'Bhojpur Area': 'Bhojpur Area', 'Dhankuta Area': 'Dhankuta Area', 'Ilam Area': 'Ilam Area', 
      'Jhapa Area': 'Jhapa Area', 'Khotang Area': 'Khotang Area', 'Morang Area': 'Morang Area', 
      'Okhaldhunga Area': 'Okhaldhunga Area', 'Panchthar Area': 'Panchthar Area', 
      'Sankhuwasabha Area': 'Sankhuwasabha Area', 'Sunsari Area': 'Sunsari Area', 
      'Taplejung Area': 'Taplejung Area', 'Terhathum Area': 'Terhathum Area', 'Bajura Area': 'Bajura Area'
    },

    // Parties
    parties: {
      'Nepal Communist Party': 'Nepal Communist Party', 'Nepali Congress': 'Nepali Congress',
      'Rastriya Prajatantra Party': 'Rastriya Prajatantra Party', 'Janata Samajbadi Party': 'Janata Samajbadi Party',
      'CPN-UML': 'CPN-UML', 'CPN-Maoist Centre': 'CPN-Maoist Centre', 'Rastriya Swatantra Party': 'Rastriya Swatantra Party',
      'Nepal Workers Peasants Party': 'Nepal Workers Peasants Party', 'Loktantrik Samajbadi Party': 'Loktantrik Samajbadi Party',
      'Independent': 'Independent', 'Janata Dal': 'Janata Dal', 'Communist Party of Nepal': 'Communist Party of Nepal',
      'Unified Socialist': 'Unified Socialist', 'Nepal Majdoor Kisan Party': 'Nepal Majdoor Kisan Party',
      'CPN UML': 'CPN UML', 'CPN-Maoist': 'CPN-Maoist', 'Rastra Swatantra Party (RSP)': 'Rastra Swatantra Party (RSP)',
      'CPN UML (Maoist)': 'CPN UML (Maoist)', 'Socialist Party': 'Socialist Party', 'Unified Socialist': 'Unified Socialist'
    },

    // Names
    names: {
      'Ram Shrestha': 'Ram Shrestha', 'Sita Tamang': 'Sita Tamang', 'Hari Gurung': 'Hari Gurung',
      'Gita Thapa': 'Gita Thapa', 'Krishna Sharma': 'Krishna Sharma', 'Maya Poudel': 'Maya Poudel',
      'Bishnu Adhikari': 'Bishnu Adhikari', 'Kamala Rai': 'Kamala Rai', 'Gopal Khadka': 'Gopal Khadka',
      'Sunita Magar': 'Sunita Magar', 'Candidate 1': 'Candidate 1', 'Candidate 2': 'Candidate 2',
      'Candidate 3': 'Candidate 3', 'Candidate 4': 'Candidate 4', 'Candidate 5': 'Candidate 5',
      'Nepal Communist Party Candidate': 'Nepal Communist Party Candidate', 'Priya Sharma': 'Priya Sharma',
      'Sagar Koirala': 'Sagar Koirala', 'Rina Chaudhary': 'Rina Chaudhary', 'Bikash Rai': 'Bikash Rai',
      'Prakash Gurung': 'Prakash Gurung', 'Sita Adhikari': 'Sita Adhikari', 'Nabin Thapa': 'Nabin Thapa',
      'Dhan Bahadur Rai': 'Dhan Bahadur Rai', 'Sushila Shrestha': 'Sushila Shrestha', 'Kiran Karki': 'Kiran Karki',
      'Prakash Limbu': 'Prakash Limbu', 'Rojina Rai': 'Rojina Rai', 'Hari Prasad Acharya': 'Hari Prasad Acharya',
      'Umesh Rai': 'Umesh Rai', 'Sabina Limbu': 'Sabina Limbu', 'Ramesh Sharma': 'Ramesh Sharma'
    },

    // Candidate Text
    candidateText: {
      'Experienced leader with 20+ years in public service': 'Experienced leader with 20+ years in public service',
      'Advocate for education and women empowerment': 'Advocate for education and women empowerment',
      'Focus on economic development and infrastructure': 'Focus on economic development and infrastructure',
      'Champion of social justice and equality': 'Champion of social justice and equality',
      'Vote for': 'Vote for', 'to represent your constituency': 'to represent your constituency',
      'You voted for this candidate': 'You voted for this candidate', 'Voting completed': 'Voting completed',
      'Vote for this Candidate': 'Vote for this Candidate', 'Select Candidate': 'Select Candidate',
      'from': 'from', 'Political Party': 'Political Party', 'to support their vision for Nepal\'s future': 'to support their vision for Nepal\'s future',
      'You voted for this party': 'You voted for this party', 'Vote for this Party': 'Vote for this Party', 'Vote Submitted': 'Vote Submitted'
    },

    // Electoral Areas
    electoralAreas: {
      'Electoral Area': 'Electoral Area',
      'yourArea': 'Your Area',
      'available': 'Available',
      'restricted': 'Restricted'
    },
  },
  
  NP: {
    // Navbar
    appName: 'नेपाल मतदान प्रणाली',
    profile: 'प्रोफाइल',
    
    // Dashboard
    welcome: 'स्वागत छ',
    selectProvince: 'मतदान गर्न आफ्नो प्रदेश चयन गर्नुहोस्',
    provinceVoting: 'प्रदेश मतदान',
    districtVoting: 'जिल्ला मतदान',
    votingHistory: 'मतदान इतिहास',
    pleaseSignIn: 'कृपया प्रदेश मतदान पृष्ठहरू पहुँच गर्न साइन इन गर्नुहोस्',
    accessDenied: 'पहुँच अस्वीकृत: तपाईं {provinceName} मा मात्र मतदान गर्न सक्नुहुन्छ',
    welcomeBack: 'फेरि स्वागत छ, {name}!',
    registeredIn: 'तपाईं दर्ता हुनुहुन्छ',
    selectProvinceToViewVoting: 'मतदान जानकारी हेर्न आफ्नो प्रदेश चयन गर्नुहोस्',
    nepalElectionVotingSystem: 'नेपाल निर्वाचन मतदान प्रणाली',
    pleaseSignInToAccess: 'कृपया आफ्नो प्रदेश मतदान पृष्ठ पहुँच गर्न साइन इन गर्नुहोस्',
    selectYourProvince: 'आफ्नो प्रदेश चयन गर्नुहोस्',
    navigateTo: 'मा जानुहोस्',
    province: 'प्रदेश',
    accessRestricted: 'पहुँच प्रतिबन्धित',
    yourProvince: 'तपाईको प्रदेश',

    // Province Template
    provincialBallot: 'प्रदेश मतपत्र',
    selectParty: 'एउटा मात्र दल छान्नुहोस्। तपाईंको छनौट अन्तिम हो।',
    prVote: 'समानुपातिक मत',
    alreadyVoted: 'पहिले नै मत दिइसकेको',
    notVotedYet: 'अझै मत दिइएको छैन',
    howItWorks: 'यो कसरी काम गर्छ',
    status: 'स्थिति',
    vote: 'मतदान',
    voted: 'मतदान गरियो',
    locked: 'लक गरिएको',
    back: 'पछाडि',
    continueToDistrict: 'जिल्ला मतदानमा जानुहोस्',
    
    // District Page
    districtBallot: 'जिल्ला मतपत्र',
    selectDistrict: 'आफ्नो जिल्ला छान्नुहोस्',
    selectDistrictFirst: 'पहिले जिल्ला चयन गर्नुहोस्',
    selectElectoralArea: 'निर्वाचन क्षेत्र छान्नुहोस्',
    fptpVote: 'प्रत्यक्ष मत',
    district: 'जिल्ला',
    electoralArea: 'निर्वाचन क्षेत्र',
    selectCandidate: 'आफ्नो निर्वाचन क्षेत्रबाट एउटा मात्र उम्मेदवार छान्नुहोस्।',
    candidates: 'उम्मेदवारहरू',
    candidate: 'उम्मेदवार',
    party: 'दल',
    independent: 'स्वतन्त्र',
    
    // Electoral Modal
    selectYourElectoralArea: 'आफ्नो निर्वाचन क्षेत्र छान्नुहोस्',
    chooseElectoralArea: 'तपाईं मतदानको लागि दर्ता भएको निर्वाचन क्षेत्र छान्नुहोस्।',
    availableAreas: 'उपलब्ध निर्वाचन क्षेत्रहरू',
    restrictedArea: 'तपाईं आफ्नो दर्ता गरिएको निर्वाचन क्षेत्रमा मात्र मतदान गर्न सक्नुहुन्छ',
    select: 'चयन गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    pleaseSelectPartyAndCandidate: 'कृपया एक पार्टी र एक उम्मेदवार चयन गर्नुहोस्',
    voteFailed: 'मत असफल भयो: {error}',
    castYourVote: 'आफ्नो मत दिनुहोस्',
    parties: 'दलहरू',
    submitVote: 'मत पेश गर्नुहोस्',
    voteCastedSuccessfully: 'मत सफलतापूर्वक कास्ट गरियो',
    close: 'बन्द गर्नुहोस्',

    // Voting
    confirmVote: 'आफ्नो मत पुष्टि गर्नुहोस्',
    confirmMessage: 'तपाईं आफ्नो मत दिन लाग्नुभएको छ। यो कार्य फिर्ता गर्न सकिँदैन।',
    selectedParty: 'चयन गरिएको दल',
    selectedCandidate: 'चयन गरिएको उम्मेदवार',
    yesCastVote: 'हो, मतदान गर्नुहोस्',
    voteSubmitted: 'मत पेश गरियो',
    voteSuccess: 'तपाईंको मत सफलतापूर्वक रेकर्ड गरिएको छ।',
    alreadyVotedError: 'तपाईंले यस श्रेणीमा पहिले नै मतदान गर्नुभएको छ।',
    
    // Access Control
    onlyVoteInRegistered: 'तपाईं मात्र मतदान गर्न सक्नुहुन्छ',
    yourRegisteredProvince: 'तपाईंको दर्ता गरिएको प्रदेश',
    yourRegisteredDistrict: 'तपाईंको दर्ता गरिएको जिल्ला',
    yourRegisteredElectoralArea: 'तपाईंको दर्ता गरिएको निर्वाचन क्षेत्र',
    backToDashboard: 'ड्यासबोर्डमा फर्कनुहोस्',
    
    // Loading
    loading: 'लोड हुँदैछ...',
    preparingBallot: 'मतपत्र तयार गर्दै...',
    submitting: 'पेश गर्दै...',
    
    // Profile
    yourProfile: 'तपाईंको प्रोफाइल',
    name: 'नाम',
    email: 'इमेल',
    username: 'प्रयोगकर्ता नाम',
    registeredProvince: 'दर्ता गरिएको प्रदेश',
    registeredDistrict: 'दर्ता गरिएको जिल्ला',
    registeredElectoralArea: 'दर्ता गरिएको निर्वाचन क्षेत्र',
    
    // Login & Register
    pleaseEnterDetails: 'जारी राख्न कृपया आफ्ना विवरणहरू प्रविष्ट गर्नुहोस्',
    password: 'पासवर्ड',
    enterEmail: 'आफ्नो इमेल प्रविष्ट गर्नुहोस्',
    enterPassword: 'आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्',
    rememberMe: 'मलाई सम्झनुहोस्',
    stayLoggedIn: 'यस उपकरणमा लग इन रहनुहोस्',
    forgotPassword: 'पासवर्ड बिर्सनुभयो?',
    forgotPasswordSoon: 'पासवर्ड बिर्सने कार्यक्षमता छिट्टै आउँदैछ!',
    loggingIn: 'लग इन गर्दै...',
    logIn: 'लग इन',
    newUser: 'नयाँ प्रयोगकर्ता?',
    registerHere: 'यहाँ दर्ता गर्नुहोस्',
    fixFormErrors: 'कृपया फारममा त्रुटिहरू सुधार गर्नुहोस्',
    passwordRequired: 'पासवर्ड आवश्यक छ',
    passwordMinLength: 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ',
    
    // Register Form
    fullName: 'पूरा नाम',
    enterFullName: 'आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्',
    phoneNumber: 'फोन नम्बर',
    nepalPhoneFormat: 'नेपाल ढाँचा: +977 XXX-XXXXXXX',
    selectProvince: 'आफ्नो प्रदेश चयन गर्नुहोस्',
    selectDistrict: 'आफ्नो जिल्ला चयन गर्नुहोस्',
    selectProvinceFirst: 'पहिले प्रदेश चयन गर्नुहोस्',
    enterVoterId: 'आफ्नो मतदाता परिचयपत्र प्रविष्ट गर्नुहोस्',
    enterCitizenshipNumber: 'आफ्नो नागरिकता नम्बर प्रविष्ट गर्नुहोस्',
    passwordRequirements: 'ठूलो अक्षर, सानो अक्षर र विशेष वर्णहरू समावेश गर्नुपर्छ',
    confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
    confirmYourPassword: 'आफ्नो पासवर्ड पुष्टि गर्नुहोस्',
    registering: 'दर्ता गर्दै...',
    register: 'दर्ता गर्नुहोस्',
    alreadyHaveAccount: 'पहिले नै खाता छ?',
    signIn: 'साइन इन',
    bsDate: 'बि.स.',
    selectBSDate: 'बि.स. मिति चयन गर्नुहोस्',
    mustBe18Plus: 'दर्ता गर्न तपाईं १८+ वर्षको हुनुपर्छ',
    
    // Profile Page
    userProfile: 'प्रयोगकर्ता प्रोफाइल',
    editAccountInfo: 'आफ्नो खाता जानकारी सम्पादन गर्नुहोस्',
    yourAccountInfo: 'तपाईंको खाता जानकारी',
    noPhoto: 'कुनै फोटो छैन',
    changePhoto: 'फोटो परिवर्तन गर्नुहोस्',
    uploadPhoto: 'फोटो अपलोड गर्नुहोस्',
    fullName: 'पूरा नाम',
    phone: 'फोन',
    address: 'ठेगाना',
    dateOfBirth: 'जन्म मिति',
    citizenshipNumber: 'नागरिकता नम्बर',
    voterId: 'मतदाता परिचय पत्र',
    editProfile: 'प्रोफाइल सम्पादन गर्नुहोस्',
    saveChanges: 'परिवर्तनहरू सेभ गर्नुहोस्',
    saving: 'सेभ गर्दै...',
    logout: 'लगआउट',
    profileUpdated: 'प्रोफाइल सफलतापूर्वक अपडेट भयो!',
    loadingProfile: 'प्रोफाइल लोड गर्दै...',
    userNotFound: 'प्रयोगकर्ता फेला परेन। कृपया फेरि लग इन गर्नुहोस्।',
    goToLogin: 'लगइनमा जानुहोस्',
    selectValidImage: 'कृपया मान्य छवि फाइल चयन गर्नुहोस्',
    imageSizeLimit: 'छविको आकार ५ MB भन्दा कम हुनुपर्छ',
    failedToReadImage: 'छवि फाइल पढ्न असफल',
    failedToUpdateProfile: 'प्रोफाइल अपडेट गर्न असफल। कृपया फेरि कोशिस गर्नुहोस्।',
    
    // Messages
    tip: 'सुझाव: आफ्नो छनौट दोब्बर जाँच गर्नुहोस्। पेश गरेपछि, तपाईं फेरि मतदान गर्न सक्नुहुन्न।',
    votedFor: 'मतदान गरियो',
    notVoted: 'तपाईंले अझै मतदान गर्नुभएको छैन।',
    voteInstructions: 'एक दल छान्नुहोस् र आफ्नो मत पेश गर्नुहोस्। प्रणालीले एक (१) दल मत मात्र लागू गर्छ। यो मतपत्र समानुपातिक प्रतिनिधित्व मतदानको लागि हो।',
    
    // Footer
    footerTitle: 'नेपाल निर्वाचन प्रणाली',
    footerTagline: 'लोकतान्त्रिक • पारदर्शी • सुरक्षित',
    footerProvinces: 'प्रदेशहरू',
    footerDistricts: 'जिल्लाहरू',
    footerCopyright: 'नेपाल निर्वाचन आयोग',
    
    // Province Names
    provinces: {
      koshi: 'कोशी प्रदेश',
      madhesh: 'मधेश प्रदेश',
      bagmati: 'बागमती प्रदेश', 
      gandaki: 'गण्डकी प्रदेश',
      lumbini: 'लुम्बिनी प्रदेश',
      karnali: 'कर्णाली प्रदेश',
      sudurpaschim: 'सुदूरपश्चिम प्रदेश'
    },

    // Validation Messages
    validation: {
      provinceRequired: 'प्रदेश चयन आवश्यक छ',
      districtRequired: 'जिल्ला आवश्यक छ',
      electoralAreaRequired: 'निर्वाचन क्षेत्र आवश्यक छ',
      dateOfBirthRequired: 'जन्म मिति आवश्यक छ',
      fixFormErrors: 'कृपया फारममा त्रुटिहरू सुधार गर्नुहोस्',
      invalidDateOfBirth: 'अवैध जन्म मिति। कृपया मिति जाँच गरेर फेरि प्रयास गर्नुहोस्।',
      accessRestricted: 'पहुँच प्रतिबन्धित',
      signInRequired: 'साइन इन आवश्यक छ',
      hidePassword: 'पासवर्ड लुकाउनुहोस्',
      showPassword: 'पासवर्ड देखाउनुहोस्'
    },

    // Common
    common: {
      loading: 'लोड हुँदैछ...',
      cancel: 'रद्द गर्नुहोस्',
      backToDashboard: 'ड्यासबोर्डमा फर्कनुहोस्',
      accessDenied: 'पहुँच अस्वीकृत'
    },

    // Voting
    voting: {
      votingTitle: 'मतदान',
      candidateVote: 'उम्मेदवार मत (प्रत्यक्ष)',
      partyVote: 'दल मत (समानुपातिक)',
      complete: 'पूरा',
      step1Title: 'चरण १: आफ्नो उम्मेदवार चयन गर्नुहोस् (प्रत्यक्ष)',
      step1Description: 'आफ्नो निर्वाचन क्षेत्रको प्रतिनिधित्व गर्न एक उम्मेदवार छान्नुहोस्',
      step2Title: 'चरण २: आफ्नो दल चयन गर्नुहोस् (समानुपातिक)',
      step2Description: 'समानुपातिक प्रतिनिधित्वको लागि एक दल छान्नुहोस्',
      alreadyVotedParty: 'तपाईंले पहिले नै मतदान गर्नुभएको छ:',
      continueToPartyVote: 'दल मतदानमा जानुहोस् →',
      backToCandidateVote: '← उम्मेदवार मतदानमा फर्कनुहोस्',
      reviewVotes: 'मतहरू समीक्षा गर्नुहोस् →',
      reviewTitle: 'आफ्ना मतहरूको समीक्षा गर्नुहोस्',
      reviewDescription: 'अन्तिम गर्नु अघि कृपया आफ्ना छनौटहरूको समीक्षा गर्नुहोस्।',
      fptpVote: 'प्रत्यक्ष मत',
      prVote: 'समानुपातिक मत',
      notVoted: 'मतदान गरिएको छैन',
      backToPartyVote: '← दल मतदानमा फर्कनुहोस्',
      completeAndDashboard: 'पूरा गर्नुहोस् र ड्यासबोर्डमा जानुहोस्',
      accessDeniedMessage: 'तपाईं आफ्नो दर्ता गरिएको प्रदेशमा मात्र मतदान गर्न सक्नुहुन्छ:',
      confirmFPTPTitle: 'प्रत्यक्ष मत पुष्टि गर्नुहोस्',
      confirmFPTPMessage: 'तपाईं उम्मेदवारको लागि एक पटक मात्र मतदान गर्न सक्नुहुन्छ।',
      selectedCandidate: 'चयन गरिएको उम्मेदवार',
      confirmPRTitle: 'समानुपातिक मत पुष्टि गर्नुहोस्',
      confirmPRMessage: 'तपाईं दलको लागि एक पटक मात्र मतदान गर्न सक्नुहुन्छ।',
      selectedParty: 'चयन गरिएको दल',
      yesCastVote: 'हो, मतदान गर्नुहोस्',
      confirmFinalTitle: 'आफ्ना अन्तिम मतहरू पुष्टि गर्नुहोस्',
      confirmFinalMessage: 'कृपया आफ्ना अन्तिम मत छनौटहरू पुष्टि गर्नुहोस्। यो कार्य फिर्ता गर्न सकिँदैन।',
      confirmFinalVotes: 'अन्तिम मतहरू पुष्टि गर्नुहोस्',
      voteConfirmed: 'तपाईंले मतदान गर्नुभएको छ:'
    },

    // Districts
    districts: {
      'Bhojpur': 'भोजपुर', 'Dhankuta': 'धनकुटा', 'Ilam': 'इलाम', 'Jhapa': 'झापा', 'Khotang': 'खोटाङ',
      'Morang': 'मोरङ', 'Okhaldhunga': 'ओखलढुङ्गा', 'Panchthar': 'पाँचथर', 'Sankhuwasabha': 'संखुवासभा',
      'Solukhumbu': 'सोलुखुम्बु', 'Sunsari': 'सुनसरी', 'Taplejung': 'ताप्लेजुङ', 'Terhathum': 'तेह्रथुम',
      'Udayapur': 'उदयपुर', 'Bara': 'बारा', 'Dhanusha': 'धनुषा', 'Mahottari': 'महोत्तरी', 'Parsa': 'पर्सा',
      'Rautahat': 'रौतहट', 'Saptari': 'सप्तरी', 'Sarlahi': 'सर्लाही', 'Siraha': 'सिराहा', 'Bhaktapur': 'भक्तपुर',
      'Chitwan': 'चितवन', 'Dhading': 'धादिङ', 'Dolakha': 'दोलखा', 'Kabhrepalanchok': 'काभ्रेपलान्चोक',
      'Kathmandu': 'काठमाडौं', 'Lalitpur': 'ललितपुर', 'Makwanpur': 'मकवानपुर', 'Nuwakot': 'नुवाकोट',
      'Ramechhap': 'रामेछाप', 'Rasuwa': 'रसुवा', 'Sindhuli': 'सिन्धुली', 'Sindhupalchok': 'सिन्धुपाल्चोक',
      'Baglung': 'बागलुङ', 'Gorkha': 'गोरखा', 'Kaski': 'कास्की', 'Lamjung': 'लमजुङ', 'Manang': 'मनाङ',
      'Mustang': 'मुस्ताङ', 'Myagdi': 'म्याग्दी', 'Nawalpur': 'नवलपुर', 'Parbat': 'पर्वत', 'Syangja': 'स्याङ्जा',
      'Tanahun': 'तनहुँ', 'Arghakhanchi': 'अर्घाखाँची', 'Banke': 'बाँके', 'Bardiya': 'बर्दिया', 'Dang': 'दाङ',
      'Gulmi': 'गुल्मी', 'Kapilvastu': 'कपिलवस्तु', 'Nawalparasi West': 'नवलपरासी पश्चिम', 'Palpa': 'पाल्पा', 'Pyuthan': 'प्युठान', 'Rolpa': 'रोल्पा',
      'Rukum East': 'रुकुम पूर्व', 'Rupandehi': 'रुपन्देही', 'Dailekh': 'दैलेख', 'Dolpa': 'डोल्पा', 'Humla': 'हुम्ला',
      'Jajarkot': 'जाजरकोट', 'Jumla': 'जुम्ला', 'Kalikot': 'कालिकोट', 'Mugu': 'मुगु', 'Rukum West': 'रुकुम पश्चिम',
      'Salyan': 'सल्यान', 'Surkhet': 'सुर्खेत', 'Achham': 'अछाम', 'Baitadi': 'बैतडी', 'Bajhang': 'बझाङ',
      'Bajura': 'बाजुरा', 'Dadeldhura': 'डडेल्धुरा', 'Darchula': 'दार्चुला', 'Doti': 'डोटी', 'Kailali': 'कैलाली',
      'Kanchanpur': 'कञ्चनपुर', 'Araria': 'अरारिया', 'Dhanusa': 'धनुषा', 'Kavrepalanchok': 'काभ्रेपलान्चोक',
      'Tanahu': 'तनहुँ', 'Argakhanchi': 'अर्घाखाँची', 'Janakpur': 'जनकपुर', 'Pithoragarh': 'पिथौरागढ',
      'Udaypur': 'उदयपुर'
    },

    // Areas (for electoral areas display)
    areas: {
      'Bhojpur Area': 'भोजपुर क्षेत्र', 'Dhankuta Area': 'धनकुटा क्षेत्र', 'Ilam Area': 'इलाम क्षेत्र', 
      'Jhapa Area': 'झापा क्षेत्र', 'Khotang Area': 'खोटाङ क्षेत्र', 'Morang Area': 'मोरङ क्षेत्र', 
      'Okhaldhunga Area': 'ओखलढुङ्गा क्षेत्र', 'Panchthar Area': 'पाँचथर क्षेत्र', 
      'Sankhuwasabha Area': 'संखुवासभा क्षेत्र', 'Sunsari Area': 'सुनसरी क्षेत्र', 
      'Taplejung Area': 'ताप्लेजुङ क्षेत्र', 'Terhathum Area': 'तेह्रथुम क्षेत्र', 'Bajura Area': 'बाजुरा क्षेत्र'
    },

    // Parties
    parties: {
      'Nepal Communist Party': 'नेपाल कम्युनिष्ट पार्टी', 'Nepali Congress': 'नेपाली कांग्रेस',
      'Rastriya Prajatantra Party': 'राष्ट्रिय प्रजातन्त्र पार्टी', 'Janata Samajbadi Party': 'जनता समाजवादी पार्टी',
      'CPN-UML': 'नेकपा एमाले', 'CPN-Maoist Centre': 'नेकपा माओवादी केन्द्र', 'Rastriya Swatantra Party': 'राष्ट्रिय स्वतन्त्र पार्टी',
      'Nepal Workers Peasants Party': 'नेपाल मजदुर किसान पार्टी', 'Loktantrik Samajbadi Party': 'लोकतान्त्रिक समाजवादी पार्टी',
      'Independent': 'स्वतन्त्र', 'Janata Dal': 'जनता दल', 'Communist Party of Nepal': 'नेपाल कम्युनिष्ट पार्टी',
      'Unified Socialist': 'एकीकृत समाजवादी', 'Nepal Majdoor Kisan Party': 'नेपाल मजदुर किसान पार्टी',
      'CPN UML': 'नेकपा एमाले', 'CPN-Maoist': 'नेकपा माओवादी', 'Rastra Swatantra Party (RSP)': 'राष्ट्र स्वतन्त्र पार्टी (आरएसपी)',
      'CPN UML (Maoist)': 'नेकपा एमाले (माओवादी)', 'Socialist Party': 'समाजवादी पार्टी', 'Unified Socialist': 'एकीकृत समाजवादी'
    },

    // Names
    names: {
      'Ram Shrestha': 'राम श्रेष्ठ', 'Sita Tamang': 'सीता तामाङ', 'Hari Gurung': 'हरि गुरुङ',
      'Gita Thapa': 'गीता थापा', 'Krishna Sharma': 'कृष्ण शर्मा', 'Maya Poudel': 'माया पौडेल',
      'Bishnu Adhikari': 'बिष्णु अधिकारी', 'Kamala Rai': 'कमला राई', 'Gopal Khadka': 'गोपाल खड्का',
      'Sunita Magar': 'सुनिता मगर', 'Candidate 1': 'उम्मेदवार १', 'Candidate 2': 'उम्मेदवार २',
      'Candidate 3': 'उम्मेदवार ३', 'Candidate 4': 'उम्मेदवार ४', 'Candidate 5': 'उम्मेदवार ५',
      'Nepal Communist Party Candidate': 'नेपाल कम्युनिष्ट पार्टी उम्मेदवार', 'Priya Sharma': 'प्रिया शर्मा',
      'Sagar Koirala': 'सागर कोइराला', 'Rina Chaudhary': 'रिना चौधरी', 'Bikash Rai': 'बिकास राई',
      'Prakash Gurung': 'प्रकाश गुरुङ', 'Sita Adhikari': 'सीता अधिकारी', 'Nabin Thapa': 'नबिन थापा',
      'Dhan Bahadur Rai': 'धन बहादुर राई', 'Sushila Shrestha': 'सुशिला श्रेष्ठ', 'Kiran Karki': 'किरण कार्की',
      'Prakash Limbu': 'प्रकाश लिम्बु', 'Rojina Rai': 'रोजिना राई', 'Hari Prasad Acharya': 'हरि प्रसाद आचार्य',
      'Umesh Rai': 'उमेश राई', 'Sabina Limbu': 'सबिना लिम्बु', 'Ramesh Sharma': 'रमेश शर्मा'
    },

    // Candidate Text
    candidateText: {
      'Experienced leader with 20+ years in public service': '२०+ वर्षको सार्वजनिक सेवामा अनुभवी नेता',
      'Advocate for education and women empowerment': 'शिक्षा र महिला सशक्तिकरणका वकिल',
      'Focus on economic development and infrastructure': 'आर्थिक विकास र पूर्वाधारमा केन्द्रित',
      'Champion of social justice and equality': 'सामाजिक न्याय र समानताका च्याम्पियन',
      'Vote for': 'मतदान गर्नुहोस्', 'to represent your constituency': 'तपाईंको निर्वाचन क्षेत्रको प्रतिनिधित्व गर्न',
      'You voted for this candidate': 'तपाईंले यस उम्मेदवारलाई मत दिनुभयो', 'Voting completed': 'मतदान सम्पन्न',
      'Vote for this Candidate': 'यस उम्मेदवारलाई मत दिनुहोस्', 'Select Candidate': 'उम्मेदवार चयन गर्नुहोस्',
      'from': 'बाट', 'Political Party': 'राजनीतिक दल', 'to support their vision for Nepal\'s future': 'नेपालको भविष्यका लागि उनीहरूको दृष्टिकोणलाई समर्थन गर्न',
      'You voted for this party': 'तपाईंले यस दललाई मत दिनुभयो', 'Vote for this Party': 'यस दललाई मत दिनुहोस्', 'Vote Submitted': 'मत पेश गरियो'
    },

    // Electoral Areas
    electoralAreas: {
      'Electoral Area': 'निर्वाचन क्षेत्र',
      'yourArea': 'तपाईंको क्षेत्र',
      'available': 'उपलब्ध',
      'restricted': 'प्रतिबन्धित'
    },
  },
};

const languageDisplayNames = {
  EN: 'English',
  NP: 'Nepali(नेपाली)'
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && (savedLang === 'EN' || savedLang === 'NP')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'EN' ? 'NP' : 'EN';
      localStorage.setItem('appLanguage', newLang);
      return newLang;
    });
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const getLanguageDisplayName = () => {
    return languageDisplayNames[language];
  };

  const value = {
    language,
    toggleLanguage,
    t,
    getLanguageDisplayName,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
