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
    selectProvinceFirst: 'Select province first',
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
  },
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

  const value = {
    language,
    toggleLanguage,
    t,
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
