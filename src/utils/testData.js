/**
 * Test Data Initialization
 * Creates sample users and data for localStorage mode testing
 */

import { storage } from '../services/storageService';

export const initializeTestData = () => {
  // Check if test data already exists
  const existingUsers = storage.getUsers();
  if (existingUsers && existingUsers.length > 0) {
    return; // Data already exists
  }

  // Create test users for each province
  const testUsers = [
    {
      id: '1',
      name: 'Ram Bahadur Thapa',
      email: 'ram@test.com',
      voterId: 'V001',
      password: 'password123',
      province: 'Province 1',
      district: 'Jhapa',
      electoralArea: 'Jhapa-1',
      address: 'Birtamod, Jhapa',
      dateOfBirth: '1990-01-15',
      citizenshipNumber: 'C001',
      faceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sita Devi Sharma',
      email: 'sita@test.com',
      voterId: 'V002',
      password: 'password123',
      province: 'Province 2',
      district: 'Dhanusha',
      electoralArea: 'Dhanusha-1',
      address: 'Janakpur, Dhanusha',
      dateOfBirth: '1985-05-20',
      citizenshipNumber: 'C002',
      faceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Hari Prasad Poudel',
      email: 'hari@test.com',
      voterId: 'V003',
      password: 'password123',
      province: 'Province 3',
      district: 'Kathmandu',
      electoralArea: 'Kathmandu-1',
      address: 'Thamel, Kathmandu',
      dateOfBirth: '1988-12-10',
      citizenshipNumber: 'C003',
      faceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: new Date().toISOString(),
    }
  ];

  // Save test users
  storage.setUsers(testUsers);

  console.log('Test data initialized with users:', testUsers.map(u => ({ voterId: u.voterId, province: u.province })));
};