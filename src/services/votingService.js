/**
 * Voting Service
 * Handles voting operations, candidate management, and voting history
 * Ready for backend API integration
 */

import { votingAPI } from './api';
import { storage } from './storageService';
import { getToken } from '../utils/authUtils';

/**
 * Voting Service
 * Manages voting operations and voting history
 */
class VotingService {
  /**
   * Get candidates for a province
   * @param {string} provinceId - Province identifier
   * @returns {Promise<Array>} - List of candidates
   */
  async getCandidates(provinceId) {
    try {
      const res = await votingAPI.getCandidates(provinceId);
      return res || [];
    } catch (error) {
      console.error('Get candidates API error:', error);
      throw error;
    }
  }

  /**
   * Submit a vote
   * @param {object} voteData - Vote data
   * @param {string} voteData.provinceId - Province identifier
   * @param {string} voteData.candidateId - Selected candidate ID
   * @returns {Promise<object>} - Vote confirmation
   */
  async submitVote(voteData) {
    try {
      const res = await votingAPI.submitVote(voteData);
      return res;
    } catch (error) {
      console.error('Submit vote API error:', error);
      throw error;
    }
  }

  /**
   * Get voting status for current user
   * @returns {Promise<object>} - Voting status information
   */
  async getVotingStatus() {
    try {
      const res = await votingAPI.getVotingStatus();
      return res;
    } catch (error) {
      console.error('Get voting status API error:', error);
      return { totalVotes: 0, votes: [], provincesVoted: [] };
    }
  }

  /**
   * Get voting history for current user
   * @returns {Array} - Array of votes
   */
  async getVotingHistory() {
    try {
      // Assuming there's an API endpoint for voting history
      const res = await votingAPI.getVotingHistory();
      return res || [];
    } catch (error) {
      console.error('Get voting history API error:', error);
      // Return empty array if API not available
      return [];
    }
  }

  /**
   * Check if user has voted in a province
   * @param {string} provinceId - Province identifier
   * @returns {boolean} - True if user has voted
   */
  async hasVotedInProvince(provinceId) {
    try {
      const votingHistory = await this.getVotingHistory();
      // Since we're using session auth, the backend knows the user
      return votingHistory.some(
        (vote) => vote.provinceId === provinceId
      );
    } catch (error) {
      console.error('Check voting status error:', error);
      return false;
    }
  }

  /**
   * Get mock candidates for demonstration
   * @param {string} provinceId - Province identifier
   * @returns {Array} - Mock candidates
   */
  getMockCandidates(provinceId) {
    const provinceNames = {
      koshi: 'Koshi',
      madhesh: 'Madhesh',
      bagmati: 'Bagmati',
      gandaki: 'Gandaki',
      lumbini: 'Lumbini',
      karnali: 'Karnali',
      sudurpaschim: 'Sudurpashchim',
    };

    const provinceName = provinceNames[provinceId.toLowerCase()] || 'Province';

    // Mock candidates with different parties
    return [
      {
        id: `${provinceId}-1`,
        name: 'Ram Shrestha',
        party: 'Nepal Communist Party',
        symbol: '☭',
        bio: 'Experienced leader with 20+ years in public service',
        image: null,
      },
      {
        id: `${provinceId}-2`,
        name: 'Sita Tamang',
        party: 'Nepali Congress',
        symbol: '🌾',
        bio: 'Advocate for education and women empowerment',
        image: null,
      },
      {
        id: `${provinceId}-3`,
        name: 'Hari Gurung',
        party: 'Rastriya Prajatantra Party',
        symbol: '🏛️',
        bio: 'Focus on economic development and infrastructure',
        image: null,
      },
      {
        id: `${provinceId}-4`,
        name: 'Gita Thapa',
        party: 'Janata Samajbadi Party',
        symbol: '⚖️',
        bio: 'Champion of social justice and equality',
        image: null,
      },
    ];
  }
}

export const votingService = new VotingService();
