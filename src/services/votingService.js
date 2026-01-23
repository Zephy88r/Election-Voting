/**
 * Voting Service
 * Handles voting operations, candidate management, and voting history
 * Connected to backend API for database operations
 */

import { votingAPI } from './api';
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

  async getParties() {
    try {
      const res = await votingAPI.getParties();
      return res || [];
    } catch (error) {
      console.error('Get parties API error:', error);
      return [];
    }
  }

  /**
   * Submit PR vote (party). Enforces 1 party vote only.
   */
  async submitPartyVote(partyId, provinceId = null, userKey = null) {
    try {
      const res = await votingAPI.submitVote({ vote_type: 'PR', party_id: partyId });
      return res;
    } catch (error) {
      console.error('Submit party vote API error:', error);
      throw error;
    }
  }

  /**
   * Check PR vote status from backend
   * Returns { voted: boolean, partyId: number|null }
   */
  async getPRVoteStatus(provinceId = null, userKey = null) {
    try {
      const history = await this.getVotingHistory();
      const found = history.find((vote) => {
        return vote.vote_type === 'PR';
      });

      if (found) {
        return { 
          voted: true, 
          partyId: found.party?.id ?? null, 
          source: 'api' 
        };
      }
    } catch (e) {
      console.error('Error checking PR vote status:', e);
    }

    return { voted: false, partyId: null, source: 'none' };
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
      const res = await votingAPI.getVotingHistory();
      // API returns { votes: [...] }
      return (res && res.votes) ? res.votes : (Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Get voting history API error:', error);
      return [];
    }
  }

  /**
   * Backwards compatible helper used in pages.
   */
  async hasVotedInProvince(provinceId, userKey = null) {
    const status = await this.getPRVoteStatus(provinceId, userKey);
    return status;
  }

  /**
   * Get mock candidates for demonstration (fallback only)
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
