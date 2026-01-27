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
        const res = await votingAPI.submitVote({ vote_type: 'CANDIDATE', candidate_id: candidateId });
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
        const res = await votingAPI.submitVote({ vote_type: 'PARTY', party_id: partyId });
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
    if (API_CONFIG.USE_API) {
      try {
        const res = await votingAPI.getVotingHistory();
        return (res && res.votes) ? res.votes : (Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Get voting history API error:', error);
        return [];
      }
    } else {
      // Use localStorage mode
      const userKey = this.getUserKey();
      const fptpVote = localStorage.getItem(`fptp_vote_${userKey}`);
      const prVote = localStorage.getItem(`pr_vote_${userKey}`);
      
      const history = [];
      if (fptpVote) {
        const vote = JSON.parse(fptpVote);
        history.push({
          vote_type: 'FPTP',
          candidate: { id: vote.candidate_id },
          timestamp: vote.timestamp
        });
      }
      if (prVote) {
        const vote = JSON.parse(prVote);
        history.push({
          vote_type: 'PR',
          party: { id: vote.party_id },
          timestamp: vote.timestamp
        });
      }
      return history;
    }
  }

  /**
   * Get consolidated voting history - groups candidate and party votes together
   * @returns {Array} - Array of consolidated vote records
   */
  async getConsolidatedVotingHistory() {
    if (API_CONFIG.USE_API) {
      try {
        const res = await votingAPI.getConsolidatedVotingHistory();
        return res.consolidated || [];
      } catch (error) {
        console.error('Get consolidated voting history API error:', error);
        // Fallback to regular history and consolidate locally
        return this.getLocalConsolidatedHistory();
      }
    } else {
      return this.getLocalConsolidatedHistory();
    }
  }

  /**
   * Get consolidated history from localStorage or regular API
   */
  async getLocalConsolidatedHistory() {
    const history = await this.getVotingHistory();
    
    // Group votes by user (in this case, all votes are for current user)
    const candidateVote = history.find(vote => vote.vote_type === 'FPTP' || vote.vote_type === 'CANDIDATE');
    const partyVote = history.find(vote => vote.vote_type === 'PR' || vote.vote_type === 'PARTY');
    
    if (candidateVote || partyVote) {
      return [{
        id: `${this.getUserKey()}_consolidated`, // Use consistent consolidated ID
        candidateVote: candidateVote || null,
        partyVote: partyVote || null,
        timestamp: candidateVote?.timestamp || partyVote?.timestamp || new Date().toISOString()
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
