import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

function Bagmati() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPartyId, setVotedPartyId] = useState(null);

  // Force exactly 4 parties (as requested) to always show.
  // These IDs are stable for UI selection; backend vote endpoint may accept numeric IDs.
  // If backend requires numeric IDs, update these to match Party table IDs.
  const parties = useMemo(
    () => [
      {
        id: 1,
        name: 'CPN UML',
        symbol: '☀️',
        description: 'Economic growth, governance reform, and national development.',
        color: 'linear-gradient(135deg, rgba(220,20,60,0.12), rgba(0,56,147,0.10))',
      },
      {
        id: 2,
        name: 'Rastra Swotantra Party (RSP)',
        symbol: '🗳️',
        description: 'Transparency, meritocracy, and youth-led transformation.',
        color: 'linear-gradient(135deg, rgba(0,56,147,0.10), rgba(40,167,69,0.10))',
      },
      {
        id: 3,
        name: 'Nepali Congress',
        symbol: '🌾',
        description: 'Democracy, inclusion, and institutional stability.',
        color: 'linear-gradient(135deg, rgba(40,167,69,0.10), rgba(220,20,60,0.10))',
      },
      {
        id: 4,
        name: 'CPN UML (Maoist)',
        symbol: '⚒️',
        description: 'Social justice, equitable development, and public welfare.',
        color: 'linear-gradient(135deg, rgba(220,20,60,0.10), rgba(255,193,7,0.12))',
      },
    ],
    []
  );

  const provinceId = 'bagmati';
  const provinceName = 'Bagmati';
  const requiredProvince = 'Province 3'; // Maps to Bagmati

  // user.province may be a string OR an object like { id, name }
  const userProvinceName = typeof user?.province === 'string' ? user?.province : user?.province?.name;

  // Check if user has access to this province
  const hasAccess = userProvinceName === requiredProvince;

  useEffect(() => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    // Determine if user has already voted (API/local)
    const init = async () => {
      try {
        setLoading(true);
        const status = await votingService.hasVotedInProvince(provinceId);
        // votingService returns { voted, partyId }
        if (typeof status === 'boolean') {
          setHasVoted(status);
        } else {
          setHasVoted(Boolean(status?.voted));
          setVotedPartyId(status?.partyId ?? null);
        }
      } catch {
        setHasVoted(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasAccess]);

  const handleVote = async (partyId) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const party = parties.find((p) => p.id === partyId);
      if (!party) throw new Error('Party not found');

      const result = await votingService.submitPartyVote(partyId, provinceId);

      setSuccess(result?.message || 'Vote submitted successfully!');
      setHasVoted(true);
      setVotedPartyId(partyId);

      notificationService.createNotification({
        type: 'success',
        title: 'Vote Submitted',
        message: `Your vote for ${party.name} has been recorded.`,
        userId: user?.id || 'api-user',
      });
    } catch (err) {
      setError(err?.message || 'Failed to submit vote');
      console.error('Vote submission error:', err);
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
              <ErrorMessage message={`You can only vote in ${userProvinceName || 'your registered province'}.`} />
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
            <p>Loading parties...</p>
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
            <p>Select your party and cast your vote</p>
          </div>

          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          {hasVoted && (
            <div className="province-page-alert">
              <p>✓ You have already voted in this province. Your vote has been recorded.</p>
            </div>
          )}

          <div className="province-page-content">
            <div className="province-voting-intro">
              <div className="province-voting-badge">PR Vote</div>
              <h2 className="province-voting-title">Choose your party</h2>
              <p className="province-voting-subtitle">
                You can vote only once in your registered province. Please review your selection carefully.
              </p>
            </div>

            <div className="candidates-grid">
              {parties.map((party) => (
                <div
                  key={party.id}
                  className="province-party-wrap"
                  style={{ background: party.color, borderRadius: 'var(--radius-lg)' }}
                >
                  <VotingCard
                    candidate={party}
                    hasVoted={hasVoted}
                    onVote={handleVote}
                    isSubmitting={submitting}
                    votedPartyId={votedPartyId}
                  />
                  <div className="province-party-footer">
                    <div className="province-party-meta">
                      <span className="province-party-symbol">{party.symbol}</span>
                      <span className="province-party-desc">{party.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="province-page-actions">
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
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

export default Bagmati;
