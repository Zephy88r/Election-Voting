/**
 * Province Constants
 * Centralized province data for consistent use across the application
 * Maps province names to their display names and routes
 */

import p1 from '../assets/Province-1.png';
import p2 from '../assets/Province-2.png';
import p3 from '../assets/Province-3.jpg';
import p4 from '../assets/Province-4.jpg';
import p5 from '../assets/Province-5.jpg';
import p6 from '../assets/province-6.png';
import p7 from '../assets/province-7.jpg';

/**
 * Province mapping: Display Name -> Route Name
 */
export const PROVINCE_MAPPING = {
  'Province 1': 'koshi',
  'Province 2': 'madhesh',
  'Province 3': 'bagmati',
  'Province 4': 'gandaki',
  'Province 5': 'lumbini',
  'Province 6': 'karnali',
  'Province 7': 'sudurpaschim',
};

/**
 * Reverse mapping: Route Name -> Display Name
 */
export const PROVINCE_REVERSE_MAPPING = {
  koshi: 'Province 1',
  madhesh: 'Province 2',
  bagmati: 'Province 3',
  gandaki: 'Province 4',
  lumbini: 'Province 5',
  karnali: 'Province 6',
  sudurpaschim: 'Province 7',
};

/**
 * Province options for dropdowns
 */
export const PROVINCE_OPTIONS = [
  'Province 1',
  'Province 2',
  'Province 3',
  'Province 4',
  'Province 5',
  'Province 6',
  'Province 7',
];

/**
 * Province data with images and routes
 */
export const PROVINCES_DATA = [
  { 
    name: 'Koshi', 
    displayName: 'Province 1', 
    routeName: 'koshi',
    img: p1, 
    path: '/koshi' 
  },
  { 
    name: 'Madhesh', 
    displayName: 'Province 2', 
    routeName: 'madhesh',
    img: p2, 
    path: '/madhesh' 
  },
  { 
    name: 'Bagmati', 
    displayName: 'Province 3', 
    routeName: 'bagmati',
    img: p3, 
    path: '/bagmati' 
  },
  { 
    name: 'Gandaki', 
    displayName: 'Province 4', 
    routeName: 'gandaki',
    img: p4, 
    path: '/gandaki' 
  },
  { 
    name: 'Lumbini', 
    displayName: 'Province 5', 
    routeName: 'lumbini',
    img: p5, 
    path: '/lumbini' 
  },
  { 
    name: 'Karnali', 
    displayName: 'Province 6', 
    routeName: 'karnali',
    img: p6, 
    path: '/karnali' 
  },
  { 
    name: 'Sudurpashchim', 
    displayName: 'Province 7', 
    routeName: 'sudurpaschim',
    img: p7, 
    path: '/sudurpaschim' 
  },
];

/**
 * Get province display name from route name
 * @param {string} routeName - Route name (e.g., 'koshi')
 * @returns {string} - Display name (e.g., 'Province 1')
 */
export const getProvinceDisplayName = (routeName) => {
  return PROVINCE_REVERSE_MAPPING[routeName] || null;
};

/**
 * Get province route name from display name
 * @param {string} displayName - Display name (e.g., 'Province 1')
 * @returns {string} - Route name (e.g., 'koshi')
 */
export const getProvinceRouteName = (displayName) => {
  return PROVINCE_MAPPING[displayName] || null;
};

/**
 * Get province data by display name
 * @param {string} displayName - Display name (e.g., 'Province 1')
 * @returns {object|null} - Province data object or null
 */
export const getProvinceByDisplayName = (displayName) => {
  return PROVINCES_DATA.find(p => p.displayName === displayName) || null;
};

/**
 * Get province data by route name
 * @param {string} routeName - Route name (e.g., 'koshi')
 * @returns {object|null} - Province data object or null
 */
export const getProvinceByRouteName = (routeName) => {
  return PROVINCES_DATA.find(p => p.routeName === routeName) || null;
};

/**
 * Get translated province name
 * @param {string} routeName - Route name (e.g., 'koshi')
 * @param {function} t - Translation function from useLanguage hook
 * @returns {string} - Translated province name
 */
export const getTranslatedProvinceName = (routeName, t) => {
  return t(`provinces.${routeName}`) || routeName;
};

export default {
  PROVINCE_MAPPING,
  PROVINCE_REVERSE_MAPPING,
  PROVINCE_OPTIONS,
  PROVINCES_DATA,
  getProvinceDisplayName,
  getProvinceRouteName,
  getProvinceByDisplayName,
  getProvinceByRouteName,
};
