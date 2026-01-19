import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { votingService } from '../services/votingService';
import Navbar from '../components/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './VotingHistory.css';

/**
 * VotingHistory Component
 * Displays user's voting history
 */
function VotingHistory() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingHistory, setVotingHistory] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadVotingHistory();
  }, [isAuthenticated, navigate]);

  /**
   * Load voting history
   */
  const loadVotingHistory = async () => {
    try {
      setLoading(true);
      const status = await votingService.getVotingStatus();
      setVotingHistory(status.votes || []);
    } catch (err) {
      setError(err.message || 'Failed to load voting history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="voting-history-page">
          <div className="voting-history-loading">
            <LoadingSpinner size="lg" />
            <p>Loading voting history...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="voting-history-page">
        <Card className="voting-history-card" variant="elevated">
          <div className="voting-history-header">
            <h1>Your Voting History</h1>
            <p>View all your votes across different provinces</p>
          </div>

          {error && <ErrorMessage message={error} />}

          {votingHistory.length === 0 ? (
            <div className="voting-history-empty">
              <p>You haven't voted in any province yet.</p>
              <Button variant="primary" onClick={() => navigate('/')}>
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="voting-history-stats">
                <div className="stat-card">
                  <div className="stat-value">{votingHistory.length}</div>
                  <div className="stat-label">Total Votes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {new Set(votingHistory.map((v) => v.provinceId)).size}
                  </div>
                  <div className="stat-label">Provinces Voted</div>
                </div>
              </div>

              <div className="voting-history-list">
                {votingHistory.map((vote) => (
                  <Card key={vote.id} className="voting-history-item" variant="outlined">
                    <div className="voting-history-item__content">
                      <div className="voting-history-item__province">
                        <h3>{vote.provinceName}</h3>
                        <p className="voting-history-item__candidate">
                          Voted for: <strong>{vote.candidateName}</strong>
                        </p>
                      </div>
                      <div className="voting-history-item__date">
                        {new Date(vote.votedAt).toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          <div className="voting-history-actions">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default VotingHistory;