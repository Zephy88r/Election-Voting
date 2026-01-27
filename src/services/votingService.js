/**
 * Voting Service
 * Handles voting operations, candidate management, and voting history
 * Connected to backend API for database operations
 */

import { votingAPI } from './api';
import { getToken } from '../utils/authUtils';
import { API_CONFIG } from '../config/apiConfig';

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
      // Fallback to mock data
      return this.getMockCandidates(provinceId);
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
   * Submit FPTP vote (candidate)
   */
  async submitFPTPVote(candidateId) {
    if (API_CONFIG.USE_API) {
      try {
        const res = await votingAPI.submitVote({ vote_type: 'FPTP', candidate_id: candidateId });
        return res;
      } catch (error) {
        console.error('Submit FPTP vote API error:', error);
        throw error;
      }
    } else {
      // Use localStorage fallback
      const userKey = this.getUserKey();
      const voteKey = `fptp_vote_${userKey}`;
      const voteData = {
        vote_type: 'FPTP',
        candidate_id: candidateId,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(voteKey, JSON.stringify(voteData));
      return { message: 'Vote recorded locally' };
    }
  }

  /**
   * Submit PR vote (party)
   */
  async submitPartyVote(partyId, provinceId = null, userKey = null) {
    if (API_CONFIG.USE_API) {
      try {
        const res = await votingAPI.submitVote({ vote_type: 'PR', party_id: partyId });
        return res;
      } catch (error) {
        console.error('Submit party vote API error:', error);
        throw error;
      }
    } else {
      // Use localStorage fallback
      const demoUserKey = this.getUserKey();
      const voteKey = `pr_vote_${demoUserKey}`;
      const voteData = {
        vote_type: 'PR',
        party_id: partyId,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(voteKey, JSON.stringify(voteData));
      return { message: 'Vote recorded locally' };
    }
  }

  /**
   * Check if user has already voted (FPTP or PR)
   * Now supports separate votes for each type
   * @returns {Promise<boolean>} - True if user has voted either FPTP or PR
   */
  async hasUserVoted() {
    try {
      const history = await this.getVotingHistory();
      return Array.isArray(history) && history.length > 0;
    } catch (e) {
      console.error('Error checking vote status:', e);
      return false;
    }
  }

  /**
   * Check if user has voted for a candidate (FPTP)
   * @returns {Promise<boolean>}
   */
  async hasUserVotedFPTP() {
    try {
      const history = await this.getVotingHistory();
      if (!Array.isArray(history)) return false;
      return history.some(vote => vote.vote_type === 'FPTP');
    } catch (e) {
      console.error('Error checking FPTP vote status:', e);
      return false;
    }
  }

  /**
   * Check if user has voted for a party (PR)
   * @returns {Promise<boolean>}
   */
  async hasUserVotedPR() {
    try {
      const history = await this.getVotingHistory();
      if (!Array.isArray(history)) return false;
      return history.some(vote => vote.vote_type === 'PR');
    } catch (e) {
      console.error('Error checking PR vote status:', e);
      return false;
    }
  }

  /**
   * Get vote type that user has already submitted (if any)
   * Returns first vote type found (either FPTP or PR)
   * @returns {Promise<string|null>} - 'FPTP', 'PR', or null
   */
  async getUserVoteType() {
    try {
      const history = await this.getVotingHistory();
      if (Array.isArray(history) && history.length > 0) {
        return history[0].vote_type || null;
      }
    } catch (e) {
      console.error('Error checking vote type:', e);
    }
    return null;
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
    // Always use API mode for voting history
    try {
      const res = await votingAPI.getVotingHistory();
      return (res && res.votes) ? res.votes : (Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Get voting history API error:', error);
      return [];
    }
  }

  /**
   * Get consolidated voting history - groups candidate and party votes together
   * @returns {Array} - Array of consolidated vote records
   */
  async getConsolidatedVotingHistory() {
    // Always use API for consolidated history
    try {
      const res = await votingAPI.getConsolidatedVotingHistory();
      return res.consolidated || [];
    } catch (error) {
      console.error('Get consolidated voting history API error:', error);
      // Fallback to regular history and consolidate locally
      return this.getLocalConsolidatedHistory();
    }
  }

  /**
   * Get consolidated voting history from localStorage or regular API
   */
  async getLocalConsolidatedHistory() {
    const history = await this.getVotingHistory();
    
    if (!Array.isArray(history) || history.length === 0) {
      return [];
    }
    
    // Group votes by user (in this case, all votes are for current user)
    const candidateVote = history.find(vote => vote.vote_type === 'FPTP' || vote.vote_type === 'CANDIDATE');
    const partyVote = history.find(vote => vote.vote_type === 'PR' || vote.vote_type === 'PARTY');
    
    if (candidateVote || partyVote) {
      return [{
        id: `${this.getUserKey()}_consolidated`,
        candidateVote: candidateVote ? {
          candidate: {
            id: candidateVote.candidate?.id || 1,
            name: candidateVote.candidate || 'Unknown Candidate'
          }
        } : null,
        partyVote: partyVote ? {
          party: {
            id: partyVote.party?.id || 1,
            name: partyVote.party || 'Unknown Party'
          }
        } : null,
        timestamp: candidateVote?.created_at || partyVote?.created_at || new Date().toISOString()
      }];
    }
    
    return [];
  }

  /**
   * Get consistent user key for localStorage
   */
  getUserKey() {
    let userKey = localStorage.getItem('demo_user_key');
    if (!userKey) {
      userKey = 'user_' + Date.now();
      localStorage.setItem('demo_user_key', userKey);
    }
    return userKey;
  }

  /**
   * Get user ID for consolidated vote display
   */
  getUserId() {
    // Return consistent user ID for vote consolidation
    return this.getUserKey();
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

    const provinceName = provinceNames[provinceId?.toLowerCase()] || 'Province';

    // Mock candidates with different parties
    return [
      {
        id: 1,
        name: 'Ram Shrestha',
        party: 'Nepal Communist Party',
        symbol: '☭',
        bio: 'Experienced leader with 20+ years in public service',
        image: null,
      },
      {
        id: 2,
        name: 'Sita Tamang',
        party: 'Nepali Congress',
        symbol: '🌾',
        bio: 'Advocate for education and women empowerment',
        image: null,
      },
      {
        id: 3,
        name: 'Hari Gurung',
        party: 'Rastriya Prajatantra Party',
        symbol: '🏛️',
        bio: 'Focus on economic development and infrastructure',
        image: null,
      },
      {
        id: 4,
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
