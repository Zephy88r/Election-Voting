/**
 * Voting Service
 * Handles voting operations, candidate management, and voting history
 * Ready for backend API integration
 */

import { votingAPI } from './api';
import { API_CONFIG } from '../config/apiConfig';
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
    if (API_CONFIG.USE_API) {
      try {
        const res = await votingAPI.getCandidates(provinceId);
        return res || [];
      } catch (error) {
        console.error('Get candidates API error:', error);
        throw error;
      }
    }

    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await votingAPI.getCandidates(provinceId);
    //   return response.candidates || response;
    // } catch (error) {
    //   throw new Error(error.message || 'Failed to fetch candidates');
    // }

    // Temporary: Mock data for demonstration
    try {
      const mockCandidates = this.getMockCandidates(provinceId);
      return mockCandidates;
    } catch (error) {
      console.error('Get candidates error:', error);
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
    if (API_CONFIG.USE_API) {
      try {
        const res = await votingAPI.submitVote(voteData);
        // On success, also record locally for UI history
        if (res && res.success) {
          const vote = {
            id: Date.now().toString(),
            voterId: (voteData.voterId || 'api'),
            provinceId: voteData.provinceId,
            candidateId: voteData.candidateId,
            candidateName: voteData.candidateName,
            provinceName: voteData.provinceName,
            votedAt: new Date().toISOString(),
          };
          const history = this.getVotingHistory();
          history.push(vote);
          storage.setItem('votingHistory', history);
        }
        return res;
      } catch (error) {
        console.error('Submit vote API error:', error);
        throw error;
      }
    }

    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await votingAPI.submitVote(voteData);
    //   this.addToVotingHistory(voteData);
    //   return response;
    // } catch (error) {
    //   throw new Error(error.message || 'Failed to submit vote');
    // }

    // Temporary: localStorage implementation
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Check if user has already voted in this province
      const votingHistory = this.getVotingHistory();
      const existingVote = votingHistory.find(
        (vote) => vote.provinceId === voteData.provinceId && vote.voterId === token
      );

      if (existingVote) {
        throw new Error('You have already voted in this province');
      }

      // Save vote
      const vote = {
        id: Date.now().toString(),
        voterId: token,
        provinceId: voteData.provinceId,
        candidateId: voteData.candidateId,
        candidateName: voteData.candidateName,
        provinceName: voteData.provinceName,
        votedAt: new Date().toISOString(),
      };

      votingHistory.push(vote);
      storage.setItem('votingHistory', votingHistory);

      return {
        success: true,
        message: 'Vote submitted successfully!',
        vote: vote,
      };
    } catch (error) {
      console.error('Submit vote error:', error);
      throw error;
    }
  }

  /**
   * Get voting status for current user
   * @returns {Promise<object>} - Voting status information
   */
  async getVotingStatus() {
    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await votingAPI.getVotingStatus();
    //   return response;
    // } catch (error) {
    //   throw new Error(error.message || 'Failed to fetch voting status');
    // }

    // Temporary: localStorage implementation
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const votingHistory = this.getVotingHistory();
      const userVotes = votingHistory.filter((vote) => vote.voterId === token);

      return {
        totalVotes: userVotes.length,
        votes: userVotes,
        provincesVoted: userVotes.map((vote) => vote.provinceId),
      };
    } catch (error) {
      console.error('Get voting status error:', error);
      throw error;
    }
  }

  /**
   * Get voting history for current user
   * @returns {Array} - Array of votes
   */
  getVotingHistory() {
    return storage.getItem('votingHistory') || [];
  }

  /**
   * Check if user has voted in a province
   * @param {string} provinceId - Province identifier
   * @returns {boolean} - True if user has voted
   */
  hasVotedInProvince(provinceId) {
    const token = getToken();
    if (!token) return false;

    const votingHistory = this.getVotingHistory();
    return votingHistory.some(
      (vote) => vote.provinceId === provinceId && vote.voterId === token
    );
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
