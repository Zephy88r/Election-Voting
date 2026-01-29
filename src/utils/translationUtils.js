/**
 * Translation Utilities
 * Helper functions for translating dynamic content like names, districts, parties
 */

/**
 * Translate district name based on current language
 * @param {string} districtName - English district name
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated district name
 */
export const translateDistrict = (districtName, t) => {
  if (!districtName) return '';
  return t(`districts.${districtName}`) || districtName;
};

/**
 * Translate party name based on current language
 * @param {string} partyName - English party name
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated party name
 */
export const translateParty = (partyName, t) => {
  if (!partyName) return '';
  
  // Check if partyName starts with "parties." - this means it's a translation key being displayed
  if (partyName.startsWith('parties.')) {
    // Extract the key and try to translate it
    const key = partyName.replace('parties.', '');
    const translatedParty = t(`parties.${key}`);
    return (translatedParty && translatedParty !== `parties.${key}`) ? translatedParty : key;
  }
  
  // Check if partyName starts with "areas." - this is a malformed key that should be cleaned
  if (partyName.startsWith('areas.')) {
    // Extract the actual party name after "areas."
    const cleanPartyName = partyName.replace('areas.', '');
    const translatedParty = t(`parties.${cleanPartyName}`);
    return (translatedParty && translatedParty !== `parties.${cleanPartyName}`) ? translatedParty : cleanPartyName;
  }
  
  // Try to get translation, but if it returns the key itself, use original name
  const translatedParty = t(`parties.${partyName}`);
  return (translatedParty && translatedParty !== `parties.${partyName}`) ? translatedParty : partyName;
};

/**
 * Translate candidate name based on current language
 * @param {string} candidateName - English candidate name
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated candidate name
 */
export const translateName = (candidateName, t) => {
  if (!candidateName) return '';
  
  // Handle patterns like "Priya Sharma (Bajura Area)"
  const parenMatch = candidateName.match(/^(.+?)\s*\((.+)\)$/);
  if (parenMatch) {
    const [, name, location] = parenMatch;
    const translatedName = t(`names.${name.trim()}`);
    const finalName = (translatedName && translatedName !== `names.${name.trim()}`) ? translatedName : name.trim();
    const translatedLocation = translateElectoralArea(location, t);
    return `${finalName} (${translatedLocation})`;
  }
  
  // Handle patterns like "Candidate 2 from Madhesh Electoral Area 1"
  const fromMatch = candidateName.match(/^(.+)\s+from\s+(.+)$/);
  if (fromMatch) {
    const [, name, location] = fromMatch;
    const translatedName = t(`names.${name}`);
    const finalName = (translatedName && translatedName !== `names.${name}`) ? translatedName : name;
    const translatedLocation = translateElectoralArea(location, t);
    return `${finalName} ${t('candidateText.from') || 'from'} ${translatedLocation}`;
  }
  
  // Check if candidateName contains malformed translation keys
  if (candidateName.includes('areas.') || candidateName.includes('parties.') || candidateName.includes('names.')) {
    // Clean up malformed keys and return just the candidate name
    let cleanName = candidateName
      .replace(/areas\./g, '')
      .replace(/parties\./g, '')
      .replace(/names\./g, '')
      .trim();
    
    // Try to translate the cleaned name
    const translatedName = t(`names.${cleanName}`);
    return (translatedName && translatedName !== `names.${cleanName}`) ? translatedName : cleanName;
  }
  
  // Try to get translation, but if it returns the key itself, use original name
  const translatedName = t(`names.${candidateName}`);
  return (translatedName && translatedName !== `names.${candidateName}`) ? translatedName : candidateName;
};

/**
 * Translate candidate description/bio text
 * @param {string} text - English text
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated text
 */
export const translateCandidateText = (text, t) => {
  if (!text) return '';
  return t(`candidateText.${text}`) || text;
};

/**
 * Translate electoral area name
 * @param {string} electoralAreaName - Electoral area name
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated electoral area name
 */
export const translateElectoralArea = (electoralAreaName, t) => {
  if (!electoralAreaName) return '';
  
  // First try direct translation from areas mapping
  const directTranslation = t(`areas.${electoralAreaName}`);
  if (directTranslation && directTranslation !== electoralAreaName) {
    return directTranslation;
  }
  
  // Handle pattern like "District Name Area" -> "District Name क्षेत्र"
  const areaMatch = electoralAreaName.match(/^(.+)\s+Area$/);
  if (areaMatch) {
    const [, districtName] = areaMatch;
    const translatedDistrict = t(`districts.${districtName}`) || districtName;
    const translatedArea = t('electoralAreas.Electoral Area') || 'क्षेत्र';
    return `${translatedDistrict} ${translatedArea}`;
  }
  
  // Handle common patterns like "Province Electoral Area 1"
  const match = electoralAreaName.match(/^(.+)\s+(Electoral Area)\s+(\d+)$/);
  if (match) {
    const [, provinceName, electoralAreaText, number] = match;
    const translatedProvince = t(`provinces.${provinceName.toLowerCase()}`) || provinceName;
    const translatedElectoralArea = t('electoralAreas.Electoral Area') || 'Electoral Area';
    return `${translatedProvince} ${translatedElectoralArea} ${number}`;
  }
  
  return electoralAreaName;
};

/**
 * Translate candidate bio with name replacement
 * @param {string} bio - Candidate bio text
 * @param {string} candidateName - Candidate name
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated bio
 */
export const translateCandidateBio = (bio, candidateName, t) => {
  if (!bio) return `${translateCandidateText('Vote for', t)} ${translateName(candidateName, t)} ${translateCandidateText('to represent your constituency', t)}.`;
  
  // Check if bio contains candidateText pattern - this means it's a malformed translation key
  if (bio.includes('candidateText.')) {
    // Always return a clean, properly translated bio instead of the malformed key
    return `${translateCandidateText('Vote for', t)} ${translateName(candidateName, t)} ${translateCandidateText('to represent your constituency', t)}.`;
  }
  
  // Try to translate the bio directly first
  const translatedBio = translateCandidateText(bio, t);
  if (translatedBio !== bio) {
    return translatedBio;
  }
  
  // If no direct translation, return the original bio
  return bio;
};

/**
 * Clean malformed translation keys from text
 * @param {string} text - Text that might contain malformed keys
 * @returns {string} - Cleaned text
 */
export const cleanMalformedKeys = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  return text
    .replace(/areas\./g, '')
    .replace(/parties\./g, '')
    .replace(/names\./g, '')
    .replace(/districts\./g, '')
    .replace(/candidateText\./g, '')
    .trim();
};

export default {
  translateDistrict,
  translateParty,
  translateName,
  translateCandidateText,
  translateElectoralArea,
  translateCandidateBio,
  cleanMalformedKeys
};