import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translateName, translateParty, translateElectoralArea, cleanMalformedKeys } from '../utils/translationUtils';
import { votingService } from '../services/votingService';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import Button from '../components/common/Button';
import CandidateCard from '../components/CandidateCard';
import VotingCard from '../components/VotingCard';
import { PROVINCE_REVERSE_MAPPING } from '../constants/provinces';
import ConfirmModal from '../components/common/ConfirmModal';
import './VoteWizard.css';

const VoteWizard = () => {
  const navigate = useNavigate();
  const { provinceId } = useParams();
  const [searchParams] = useSearchParams();
  const electoralAreaId = searchParams.get('ea');
  const { user } = useAuth();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: FPTP Voting
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [fptpVoted, setFptpVoted] = useState(false);
  const [votedCandidateId, setVotedCandidateId] = useState(null);

  // Step 2: PR Voting
  const [parties, setParties] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [prVoted, setPrVoted] = useState(false);
  const [votedPartyId, setVotedPartyId] = useState(null);

  // Local selections (not submitted to backend yet)
  const [localCandidateSelection, setLocalCandidateSelection] = useState(null);
  const [localPartySelection, setLocalPartySelection] = useState(null);

  // Modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, id: null });
  const [history, setHistory] = useState([]);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [finalVoteData, setFinalVoteData] = useState({ candidate: null, party: null });

  const userProvinceName = user?.province?.name;
  const requiredProvinceName = PROVINCE_REVERSE_MAPPING[provinceId];
  const hasAccess = userProvinceName === requiredProvinceName;

  // Debug logging for province access
  console.log('Province access check:', {
    provinceId,
    userProvinceName,
    requiredProvinceName,
    hasAccess
  });

  useEffect(() => {
    const init = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, check voting status immediately to show completion screen if user has voted
        const history = await votingService.getVotingHistory();
        setHistory(history);
        console.log('Voting history:', history);
        
        const fptpVote = history.find(vote => vote.vote_type === 'FPTP');
        const prVote = history.find(vote => vote.vote_type === 'PR');
        
        // If user has already voted, set completion state immediately
        if (fptpVote || prVote) {
          console.log('User has already voted, showing completion screen');
          setCurrentStep(3);
          setShowVoteConfirmation(true);
          setFptpVoted(!!fptpVote);
          setPrVoted(!!prVote);
          if (fptpVote) {
            setVotedCandidateId(fptpVote.candidate?.id || null);
          }
          if (prVote) {
            setVotedPartyId(prVote.party?.id || null);
          }
        }
        
        // Load candidates and parties (needed for completion screen display)
        const [candidatesData, partiesData] = await Promise.all([
          votingService.getCandidates(electoralAreaId || provinceId).catch(() => []),
          votingService.getParties().catch(() => [])
        ]);

        // Ensure candidates have proper structure
        const processedCandidates = (candidatesData || []).map(candidate => ({
          id: candidate.id,
          name: cleanMalformedKeys(candidate.name || candidate.full_name || 'Unknown Candidate'),
          party: cleanMalformedKeys(candidate.party || candidate.party_name || 'Independent'),
          symbol: candidate.symbol || '👤',
          bio: `Vote for ${cleanMalformedKeys(candidate.name || candidate.full_name || 'this candidate')} to represent your constituency.`
        }));

        setCandidates(processedCandidates);
        const filteredParties = (partiesData || []).filter(
          (party) => party?.name !== 'Test Party'
        );
        setParties(filteredParties);

        // Add "None of the Above" option to candidates (only if user hasn't voted)
        if (!fptpVote && !prVote) {
          const candidatesWithNone = [
            ...processedCandidates,
            {
              id: 'none',
              name: 'None of the Above',
              party: 'No Party',
              symbol: '❌',
              bio: 'Select this option if you do not wish to vote for any of the listed candidates.'
            }
          ];
          setCandidates(candidatesWithNone);
        }
        
        // Update final vote data with loaded candidates/parties if user has voted
        if (fptpVote || prVote) {
          // Try to find candidate by ID first, then by name
          let votedCandidate = null;
          if (fptpVote?.candidate) {
            const candidateId = typeof fptpVote.candidate === 'object' ? fptpVote.candidate.id : null;
            const candidateName = typeof fptpVote.candidate === 'object' ? fptpVote.candidate.name : fptpVote.candidate;
            
            if (candidateId) {
              votedCandidate = processedCandidates.find(c => c.id === candidateId);
            }
            if (!votedCandidate && candidateName) {
              votedCandidate = processedCandidates.find(c => 
                c.name === candidateName || c.name?.toLowerCase() === candidateName?.toLowerCase()
              );
            }
            if (!votedCandidate) {
              votedCandidate = {
                name: cleanMalformedKeys(candidateName || 'Unknown Candidate'),
                party: cleanMalformedKeys((typeof fptpVote.candidate === 'object' && fptpVote.candidate.party) || 'Unknown Party')
              };
            }
          }
          
          // Try to find party by ID first, then by name
          let votedParty = null;
          if (prVote?.party) {
            const partyId = typeof prVote.party === 'object' ? prVote.party.id : null;
            const partyName = typeof prVote.party === 'object' ? prVote.party.name : prVote.party;
            
            if (partyId) {
              votedParty = filteredParties.find(p => p.id === partyId);
            }
            if (!votedParty && partyName) {
              votedParty = filteredParties.find(p => 
                p.name === partyName || p.name?.toLowerCase() === partyName?.toLowerCase()
              );
            }
            if (!votedParty) {
              votedParty = {
                name: cleanMalformedKeys(partyName || 'Unknown Party')
              };
            }
          }
          
          setFinalVoteData({
            candidate: votedCandidate,
            party: votedParty
          });
        } else {
          console.log('No votes found, setting step to 1');
          setCurrentStep(1);
        }

      } catch (err) {
        console.error('Error loading voting data:', err);
        setError('Failed to load voting data');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasAccess, provinceId, electoralAreaId]);

  const handleCandidateVote = (candidateId) => {
    // Just store local selection, don't submit to backend yet
    setLocalCandidateSelection(candidateId);
    // Auto-navigate to next step after 1 second
    setTimeout(() => {
      setCurrentStep(2);
    }, 1000);
  };

  const handlePartyVote = (partyId) => {
    // Just store local selection, don't submit to backend yet
    setLocalPartySelection(partyId);
    // Auto-navigate to complete step after 1 second
    setTimeout(() => {
      setCurrentStep(3);
    }, 1000);
  };

  const handleFinalConfirmation = () => {
    // Use local selections for final confirmation
    const selectedCandidate = localCandidateSelection ? candidates.find(c => c.id === localCandidateSelection) : null;
    const selectedParty = localPartySelection ? parties.find(p => p.id === localPartySelection) : null;
    
    setFinalVoteData({
      candidate: selectedCandidate,
      party: selectedParty
    });
    
    setConfirmModal({ open: true, type: 'final', id: null });
  };

  const confirmVote = async () => {
    const { type } = confirmModal;
    
    if (type === 'final') {
      // Handle final confirmation - save all votes to backend
      try {
        setSubmitting(true);
        setError('');
        setSuccess('');

        // Submit votes to backend
        if (localCandidateSelection && localCandidateSelection !== 'none') {
          await votingService.submitFPTPVote(localCandidateSelection);
        }
        if (localPartySelection) {
          await votingService.submitPartyVote(localPartySelection);
        }

        // Show confirmation message
        setShowVoteConfirmation(true);
        setConfirmModal({ open: false, type: null, id: null });
        setSuccess('Your votes have been successfully recorded!');
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);

      } catch (err) {
        console.error('Final vote confirmation error:', err);
        setError('Failed to confirm votes. Please try again.');
        setShowVoteConfirmation(false);
      } finally {
        setSubmitting(false);
      }
      return;
    }
  };

  const cancelVote = () => {
    setConfirmModal({ open: false, type: null, id: null });
  };

  if (!hasAccess) {
    return (
      <>
        <Navbar />
        <div className="vote-wizard">
          <div className="vote-wizard__content">
            <div className="access-denied">
              <h2>{t('common.accessDenied', 'Access Denied')}</h2>
              <p>{t('voting.accessDeniedMessage', 'You can only vote in your registered province:')} <b>{userProvinceName}</b></p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                {t('common.backToDashboard', 'Back to Dashboard')}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="vote-wizard">
          <div className="vote-wizard__content">
            <div className="loading-box">
              <LoadingSpinner size="lg" />
              <div>{t('common.loading', 'Loading voting data...')}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getConfirmModalContent = () => {
    const { type, id } = confirmModal;
    
    if (type === 'final') {
      return {
        title: t('voting.confirmFinalTitle', 'Confirm Your Final Votes'),
        message: t('voting.confirmFinalMessage', 'Please confirm your final vote selections. This action cannot be undone.'),
        children: (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('voting.selectedCandidate', 'Selected Candidate')}</div>
              <div style={{ marginTop: 4, fontWeight: 900, color: 'var(--color-text-primary)' }}>
                {finalVoteData.candidate?.name || 'None selected'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('voting.selectedParty', 'Selected Party')}</div>
              <div style={{ marginTop: 4, fontWeight: 900, color: 'var(--color-text-primary)' }}>
                {finalVoteData.party?.name || 'None selected'}
              </div>
            </div>
          </div>
        )
      };
    }
    
    if (type === 'candidate') {
      const candidate = candidates.find(c => c.id === id);
      return {
        title: t('voting.confirmFPTPTitle', 'Confirm FPTP Vote'),
        message: t('voting.confirmFPTPMessage', 'You can vote only once for a candidate.'),
        children: (
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('voting.selectedCandidate', 'Selected Candidate')}</div>
            <div style={{ marginTop: 4, fontWeight: 900, color: 'var(--color-text-primary)' }}>
              {candidate?.name} ({candidate?.party})
            </div>
          </div>
        )
      };
    } else if (type === 'party') {
      const party = parties.find(p => p.id === id);
      return {
        title: t('voting.confirmPRTitle', 'Confirm PR Vote'),
        message: t('voting.confirmPRMessage', 'You can vote only once for a party.'),
        children: (
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('voting.selectedParty', 'Selected Party')}</div>
            <div style={{ marginTop: 4, fontWeight: 900, color: 'var(--color-text-primary)' }}>
              {party?.name}
            </div>
          </div>
        )
      };
    }
    return {};
  };

  return (
    <>
      <Navbar />
      
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={cancelVote}
        onConfirm={confirmVote}
        isSubmitting={submitting}
        confirmText={t('voting.yesCastVote', 'Yes, Cast Vote')}
        cancelText={t('common.cancel', 'Cancel')}
        {...getConfirmModalContent()}
      />

      <div className="vote-wizard">
        <div className="vote-wizard__content">
          <div className="vote-wizard__header">
            <h1>{requiredProvinceName} {t('voting.votingTitle', 'Voting')}</h1>
            <div className="vote-wizard__steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${fptpVoted ? 'completed' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">{t('voting.candidateVote', 'Candidate Vote (FPTP)')}</span>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${prVoted ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">{t('voting.partyVote', 'Party Vote (PR)')}</span>
              </div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <span className="step-number">✓</span>
                <span className="step-label">{t('voting.complete', 'Complete')}</span>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          {currentStep === 1 && (
            <div className="vote-step">
              <div className="step-header">
                <h2>{t('voting.step1Title', 'Step 1: Select Your Candidate (FPTP)')}</h2>
                <p>{t('voting.step1Description', 'Choose one candidate to represent your constituency')}</p>
              </div>
              
              <div className="candidates-grid">
                {candidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    hasVoted={false}
                    onVote={handleCandidateVote}
                    isSubmitting={submitting}
                    votedCandidateId={localCandidateSelection}
                    isSelected={localCandidateSelection === candidate.id}
                    onSelect={setLocalCandidateSelection}
                  />
                ))}
              </div>
              
              <div className="step-actions">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  {t('common.backToDashboard', 'Back to Dashboard')}
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(2)} disabled={!localCandidateSelection}>
                  {t('voting.continueToPartyVote', 'Continue to Party Vote →')}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="vote-step">
              <div className="step-header">
                <h2>{t('voting.step2Title', 'Step 2: Select Your Party (PR)')}</h2>
                <p>{t('voting.step2Description', 'Choose one party for proportional representation')}</p>
                {localPartySelection && <p style={{color: 'var(--color-success)'}}>✓ {t('voting.alreadyVotedParty', 'You have selected:')} {parties.find(p => p.id === localPartySelection)?.name}</p>}
              </div>
              
              <div className="parties-grid">
                {parties.map(party => (
                  <VotingCard
                    key={party.id}
                    candidate={party}
                    hasVoted={false}
                    onVote={handlePartyVote}
                    isSubmitting={submitting}
                    votedPartyId={localPartySelection}
                  />
                ))}
              </div>
              
              <div className="step-actions">
                <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                  {t('voting.backToCandidateVote', '← Back to Candidate Vote')}
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(3)} disabled={!localPartySelection && !localCandidateSelection}>
                  {t('voting.reviewVotes', 'Review Votes →')}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="vote-step">
              {showVoteConfirmation ? (
                <div className="completion-message">
                  <div className="completion-icon">✅</div>
                  <h2>{t('voting.voteConfirmed', 'You have voted for:')}</h2>
                  <div className="vote-summary">
                    <div style={{marginBottom: '12px', fontSize: '18px', padding: '8px', backgroundColor: 'var(--color-success-light)', borderRadius: '4px'}}>
                      <strong>{t('candidate', 'उम्मेदवार')}: {finalVoteData.candidate ? translateName(finalVoteData.candidate.name, t) : t('voting.notVoted', 'Not voted')} {finalVoteData.candidate?.party ? `(${translateElectoralArea(finalVoteData.candidate.party, t)})` : ''}</strong>
                    </div>
                    <div style={{marginBottom: '12px', fontSize: '18px', padding: '8px', backgroundColor: 'var(--color-success-light)', borderRadius: '4px'}}>
                      <strong>{t('party', 'दल')}: {finalVoteData.party ? translateParty(finalVoteData.party.name, t) : t('voting.notVoted', 'Not voted')}</strong>
                    </div>
                  </div>
                  <div className="step-actions">
                    <Button variant="primary" onClick={() => navigate('/dashboard')}>
                      {t('voting.completeAndDashboard', 'Complete & Go to Dashboard')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="completion-message">
                  <div className="completion-icon">🎉</div>
                  <h2>{t('voting.reviewTitle', 'Review Your Votes')}</h2>
                  <p>{t('voting.reviewDescription', 'Please review your selections before finalizing.')}</p>
                  <div className="vote-summary">
                    <div style={{marginBottom: '8px', fontSize: '16px'}}>
                      <strong>{localCandidateSelection ? 
                        `${t('candidate', 'Candidate')}: ${translateName(candidates.find(c => c.id === localCandidateSelection)?.name, t)}` : 
                        `${t('candidate', 'Candidate')}: ${t('voting.notVoted', 'Not voted')}`}</strong>
                    </div>
                    <div style={{marginBottom: '8px', fontSize: '16px'}}>
                      <strong>{localPartySelection ? 
                        `${t('party', 'Party')}: ${translateParty(parties.find(p => p.id === localPartySelection)?.name, t)}` : 
                        `${t('party', 'Party')}: ${t('voting.notVoted', 'Not voted')}`}</strong>
                    </div>
                  </div>
                  <div className="step-actions">
                    <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                      {t('voting.backToPartyVote', '← Back to Party Vote')}
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleFinalConfirmation}
                      disabled={!localCandidateSelection && !localPartySelection}
                    >
                      {t('voting.confirmFinalVotes', 'Confirm Final Votes')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoteWizard;
