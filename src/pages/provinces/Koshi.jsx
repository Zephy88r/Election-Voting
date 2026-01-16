import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import VotingCard from '../../components/VotingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import { votingService } from '../../services/votingService';
import { notificationService } from '../../services/notificationService';
import './ProvincePage.css';

/**
 * Koshi Province Page
 * Voting page for Koshi Province with candidate selection
 * Includes province-based access control
 */
function Koshi() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const provinceId = 'koshi';
  const provinceName = 'Koshi';
  const requiredProvince = 'Province 1'; // Maps to Koshi - TODO: Use getProvinceDisplayName from constants

  // Check if user has access to this province
  const hasAccess = user?.province === requiredProvince;

  useEffect(() => {
    // Check access first
    if (!hasAccess) {
      setLoading(false);
      return;
    }
    loadCandidates();
    checkVotingStatus();
  }, [hasAccess]);

  /**
   * Load candidates
   */
  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await votingService.getCandidates(provinceId);
      setCandidates(data);
    } catch (err) {
      setError(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user has already voted
   */
  const checkVotingStatus = () => {
    const voted = votingService.hasVotedInProvince(provinceId);
    setHasVoted(voted);
  };

  /**
   * Handle vote submission
   */
  const handleVote = async (candidateId) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const voteData = {
        provinceId,
        candidateId,
        candidateName: candidate.name,
        provinceName,
      };

      const result = await votingService.submitVote(voteData);

      setSuccess(result.message || 'Vote submitted successfully!');
      setHasVoted(true);

      // Create notification
      notificationService.createNotification({
        type: 'success',
        title: 'Vote Submitted',
        message: `Your vote for ${candidate.name} in ${provinceName} has been recorded.`,
        userId: localStorage.getItem('token'),
      });

      // Reload candidates to update UI
      setTimeout(() => {
        loadCandidates();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  // Access denied - redirect to dashboard
  if (!hasAccess) {
    return (
      <>
        <Navbar />
        <div className="province-page">
          <Card className="province-page-card" variant="elevated">
            <div className="access-denied">
              <h2>Access Denied</h2>
              <ErrorMessage message={`You can only vote in ${user?.province || 'your registered province'}.`} />
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="province-page">
          <div className="province-page-loading">
            <LoadingSpinner size="lg" />
            <p>Loading candidates...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="province-page">
        <Card className="province-page-card" variant="elevated">
          <div className="province-page-header">
            <h1>{provinceName} Province</h1>
            <p>Select your candidate and cast your vote</p>
          </div>

          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          {hasVoted && (
            <div className="province-page-alert">
              <p>✓ You have already voted in this province. Your vote has been recorded.</p>
            </div>
          )}

          <div className="province-page-content">
            <div className="candidates-grid">
              {candidates.map((candidate) => (
                <VotingCard
                  key={candidate.id}
                  candidate={candidate}
                  hasVoted={hasVoted}
                  onVote={handleVote}
                  isSubmitting={submitting}
                />
              ))}
            </div>
          </div>

          <div className="province-page-actions">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/voting-history')}>
              View Voting History
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Koshi;
