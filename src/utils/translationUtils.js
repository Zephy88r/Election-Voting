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
  return t(`parties.${partyName}`) || partyName;
};

/**
 * Translate candidate name based on current language
 * @param {string} candidateName - English candidate name
 * @param {function} t - Translation function from useLanguage
 * @returns {string} - Translated candidate name
 */
export const translateName = (candidateName, t) => {
  if (!candidateName) return '';
  
  // Handle patterns like "Candidate 2 from Madhesh Electoral Area 1"
  const match = candidateName.match(/^(.+)\s+from\s+(.+)$/);
  if (match) {
    const [, name, location] = match;
    const translatedName = t(`names.${name}`) || name;
    const translatedLocation = translateElectoralArea(location, t);
    return `${translatedName} ${t('candidateText.from') || 'from'} ${translatedLocation}`;
  }
  
  return t(`names.${candidateName}`) || candidateName;
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
  if (!bio) return `${translateCandidateText('Vote for', t)} ${translateName(candidateName, t)} ${translateCandidateText('to represent your constituency', t)}`;
  
  // Try to translate the bio directly first
  const translatedBio = translateCandidateText(bio, t);
  if (translatedBio !== bio) {
    return translatedBio;
  }
  
  // If no direct translation, return the original bio
  return bio;
};

export default {
  translateDistrict,
  translateParty,
  translateName,
  translateCandidateText,
  translateElectoralArea,
  translateCandidateBio
};