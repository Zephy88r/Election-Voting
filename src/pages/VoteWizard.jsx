import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translateName, translateParty } from '../utils/translationUtils';
import { votingService } from '../services/votingService';
import { notificationService } from '../services/notificationService';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import Button from '../components/common/Button';
import CandidateCard from '../components/CandidateCard';
import VotingCard from '../components/VotingCard';
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

  // Modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, id: null });
  const [history, setHistory] = useState([]);

  const provinceNames = {
    koshi: 'Province 1',
    madhesh: 'Province 2',
    bagmati: 'Province 3',
    gandaki: 'Province 4',
    lumbini: 'Province 5',
    karnali: 'Province 6',
    sudurpaschim: 'Province 7'
  };

  const userProvinceName = user?.province?.name || user?.province;
  const requiredProvinceName = provinceNames[provinceId];
  const hasAccess = userProvinceName === requiredProvinceName;

  useEffect(() => {
    const init = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Load candidates and parties
        const [candidatesData, partiesData] = await Promise.all([
          votingService.getCandidates(electoralAreaId || provinceId).catch(() => []),
          votingService.getParties().catch(() => [])
        ]);

        // Ensure candidates have proper structure
        const processedCandidates = (candidatesData || []).map(candidate => ({
          id: candidate.id,
          name: candidate.name || candidate.full_name || 'Unknown Candidate',
          party: candidate.party || candidate.party_name || 'Independent',
          symbol: candidate.symbol || '👤',
          bio: candidate.bio || candidate.description || `Vote for ${candidate.name || 'this candidate'} to represent your constituency.`
        }));

        setCandidates(processedCandidates);
        setParties(partiesData || []);

        // Check voting status
        const history = await votingService.getVotingHistory();
        setHistory(history); // Store history in state
        console.log('Voting history:', history); // Debug log
        
        // Check if user has voted for FPTP or PR
        const fptpVote = history.find(vote => vote.vote_type === 'FPTP');
        const prVote = history.find(vote => vote.vote_type === 'PR');
        
        if (fptpVote) {
          setFptpVoted(true);
          setVotedCandidateId(fptpVote.candidate?.id || null);
        }
        
        if (prVote) {
          setPrVoted(true);
          setVotedPartyId(prVote.party?.id || null);
        }
        
        // If any vote exists, go to step 3
        if (fptpVote || prVote) {
          console.log('Vote found, setting step to 3');
          setCurrentStep(3);
        } else {
          console.log('No votes found, setting step to 1');
          setCurrentStep(1);
        }

      } catch (err) {
        console.error('Error loading voting data:', err);
        setError('Failed to load voting data');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasAccess, provinceId, electoralAreaId]);

  const handleCandidateVote = (candidateId) => {
    setConfirmModal({ open: true, type: 'candidate', id: candidateId });
  };

  const handlePartyVote = (partyId) => {
    setConfirmModal({ open: true, type: 'party', id: partyId });
  };

  const confirmVote = async () => {
    const { type, id } = confirmModal;
    if (!id) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      if (type === 'candidate') {
        const candidate = candidates.find(c => c.id === id);
        await votingService.submitFPTPVote(id);
        
        setFptpVoted(true);
        setVotedCandidateId(id);
        setSuccess(`Vote submitted for ${candidate?.name}`);
        
        // Refresh voting history to get updated status
        const updatedHistory = await votingService.getVotingHistory();
        setHistory(updatedHistory);
        const updatedFptpVote = updatedHistory.find(vote => vote.vote_type === 'FPTP');
        if (updatedFptpVote) {
          setVotedCandidateId(updatedFptpVote.candidate?.id || null);
        }
        
        // Skip notification creation to avoid API errors
        // notificationService.createNotification({
        //   type: 'success',
        //   title: 'FPTP Vote Submitted',
        //   message: `Your vote for ${candidate?.name} has been recorded.`,
        //   userId: user?.id || 'api-user',
        // });

        setTimeout(() => {
          setCurrentStep(2);
          setSuccess('');
        }, 2000);

      } else if (type === 'party') {
        const party = parties.find(p => p.id === id);
        await votingService.submitPartyVote(id);
        
        setPrVoted(true);
        setVotedPartyId(id);
        setSuccess(`Vote submitted for ${party?.name}`);
        
        // Refresh voting history to get updated status
        const updatedHistory = await votingService.getVotingHistory();
        setHistory(updatedHistory);
        const updatedPrVote = updatedHistory.find(vote => vote.vote_type === 'PR');
        if (updatedPrVote) {
          setVotedPartyId(updatedPrVote.party?.id || null);
        }
        
        // Skip notification creation to avoid API errors
        // notificationService.createNotification({
        //   type: 'success',
        //   title: 'PR Vote Submitted',
        //   message: `Your vote for ${party?.name} has been recorded.`,
        //   userId: user?.id || 'api-user',
        // });

        setTimeout(() => {
          setCurrentStep(3);
          setSuccess('');
        }, 2000);
      }

      setConfirmModal({ open: false, type: null, id: null });
    } catch (err) {
      console.error('Vote submission error:', err);
      const errorMessage = err?.message || 'Failed to submit vote';
      
      // Handle OneToOneField constraint error from backend
      if (errorMessage.includes('already') || errorMessage.includes('IntegrityError') || errorMessage.includes('UNIQUE constraint failed')) {
        setError('You have already voted. Each voter can only submit one vote (either FPTP or PR, not both). This is due to a backend system limitation.');
        setCurrentStep(3); // Go to completion step
      } else {
        setError(errorMessage);
      }
      
      setConfirmModal({ open: false, type: null, id: null });
    } finally {
      setSubmitting(false);
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
                    hasVoted={fptpVoted}
                    onVote={handleCandidateVote}
                    isSubmitting={submitting}
                    votedCandidateId={votedCandidateId}
                    isSelected={selectedCandidateId === candidate.id}
                    onSelect={setSelectedCandidateId}
                  />
                ))}
              </div>
              
              <div className="step-actions">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  {t('common.backToDashboard', 'Back to Dashboard')}
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(2)} disabled={!fptpVoted}>
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
                {prVoted && <p style={{color: 'var(--color-success)'}}>✓ {t('voting.alreadyVotedParty', 'You have already voted for:')} {parties.find(p => p.id === votedPartyId)?.name}</p>}
              </div>
              
              <div className="parties-grid">
                {parties.map(party => (
                  <VotingCard
                    key={party.id}
                    candidate={party}
                    hasVoted={prVoted}
                    onVote={handlePartyVote}
                    isSubmitting={submitting}
                    votedPartyId={votedPartyId}
                  />
                ))}
              </div>
              
              <div className="step-actions">
                <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                  {t('voting.backToCandidateVote', '← Back to Candidate Vote')}
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(3)} disabled={!prVoted && !fptpVoted}>
                  {t('voting.reviewVotes', 'Review Votes →')}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="vote-step">
              <div className="completion-message">
                <div className="completion-icon">🎉</div>
                <h2>{t('voting.reviewTitle', 'Review Your Votes')}</h2>
                <p>{t('voting.reviewDescription', 'Please review your selections before finalizing.')}</p>
                <div className="vote-summary">
                  <div style={{marginBottom: '8px', fontSize: '16px'}}>
                    <strong>{history.find(vote => vote.vote_type === 'FPTP')?.candidate ? 
                      `${t('candidate')}: ${translateName(history.find(vote => vote.vote_type === 'FPTP').candidate.name || history.find(vote => vote.vote_type === 'FPTP').candidate, t)}` : 
                      t('voting.notVoted', 'Not voted')}</strong>
                  </div>
                  <div style={{marginBottom: '8px', fontSize: '16px'}}>
                    <strong>{history.find(vote => vote.vote_type === 'PR')?.party ? 
                      `${t('party')}: ${translateParty(history.find(vote => vote.vote_type === 'PR').party.name || history.find(vote => vote.vote_type === 'PR').party, t)}` : 
                      t('voting.notVoted', 'Not voted')}</strong>
                  </div>
                </div>
                <div className="step-actions">
                  <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                    {t('voting.backToPartyVote', '← Back to Party Vote')}
                  </Button>
                  <Button variant="primary" onClick={() => navigate('/dashboard')}>
                    {t('voting.completeAndDashboard', 'Complete & Go to Dashboard')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoteWizard;