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
  // Local fallback (when API history isn't available)
  // Stores a single PR vote globally: { vote_type: 'PR', party_id, province_id, created_at }
  LOCAL_PR_VOTE_KEY = 'nepal-election:local-pr-vote';

  _getLocalPRVote() {
    try {
      const raw = localStorage.getItem(this.LOCAL_PR_VOTE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _setLocalPRVote(vote) {
    localStorage.setItem(this.LOCAL_PR_VOTE_KEY, JSON.stringify(vote));
  }

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
  async submitPartyVote(partyId, provinceId = null) {
    // Enforce single PR vote (global)
    const existing = this._getLocalPRVote();
    if (existing?.party_id) {
      const err = new Error('You have already voted. Only one party vote is allowed.');
      err.code = 'ALREADY_VOTED';
      throw err;
    }

    try {
      const res = await votingAPI.submitVote({ vote_type: 'PR', party_id: partyId });

      // On success, persist local marker too (helps UI enforce without refetch)
      this._setLocalPRVote({
        vote_type: 'PR',
        party_id: partyId,
        province_id: provinceId,
        created_at: new Date().toISOString(),
        source: 'api',
      });

      return res;
    } catch (error) {
      console.error('Submit party vote API error:', error);

      // Fallback: if API fails, still record locally so user can proceed in UI demo mode
      // If you want strict backend-only voting, remove this block.
      this._setLocalPRVote({
        vote_type: 'PR',
        party_id: partyId,
        province_id: provinceId,
        created_at: new Date().toISOString(),
        source: 'local',
      });

      return { message: 'Vote recorded locally (backend unavailable).', local: true };
    }
  }

  /**
   * Unified PR vote status check.
   * Returns { voted: boolean, partyId: number|null }
   */
  async getPRVoteStatus(provinceId = null) {
    // First try backend history
    try {
      const history = await this.getVotingHistory();
      const found = history.find((vote) => {
        // Django returns: vote_type, province: {name}, and party: {id}
        const isPR = vote.vote_type === 'PR';
        if (!isPR) return false;

        // If provinceId is provided (e.g. 'bagmati'), we don't have a strict mapping from API yet,
        // so treat PR as global one-time vote.
        return true;
      });

      if (found) return { voted: true, partyId: found.party?.id ?? null, source: 'api' };
    } catch (e) {
      // ignore and fallback to local
    }

    const local = this._getLocalPRVote();
    if (local?.party_id) {
      return { voted: true, partyId: local.party_id, source: local.source || 'local' };
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
  async hasVotedInProvince(provinceId) {
    const status = await this.getPRVoteStatus(provinceId);
    return status;
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
