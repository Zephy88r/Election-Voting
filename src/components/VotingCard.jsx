import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateParty, translateCandidateText } from '../utils/translationUtils';
import Card from './common/Card';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';
import SuccessMessage from './common/SuccessMessage';
import './VotingCard.css';

/**
 * VotingCard Component
 * Displays party information and voting functionality
 * 
 * @param {object} candidate - Party data (for backward compatibility, actually represents party)
 * @param {boolean} hasVoted - Whether user has already voted
 * @param {function} onVote - Vote handler function
 * @param {boolean} isSubmitting - Whether vote is being submitted
 */
const VotingCard = ({ candidate, hasVoted, onVote, isSubmitting, votedPartyId }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useLanguage();

  const isVotedParty = votedPartyId === candidate.id;
  const isDisabled = hasVoted && !isVotedParty;

  const handleVote = () => {
    if (!hasVoted && !isSubmitting) {
      setSelected(true);
      onVote(candidate.id);
    }
  };

  // Party symbols mapping
  const getPartySymbol = (partyName) => {
    const symbols = {
      'CPN UML': '☀️',
      'Nepali Congress': '🌳',
      'Rastra Swatantra Party (RSP)': '🔔',
      'CPN UML (Moist)': '☭'
    };
    return symbols[partyName] || '🏛️';
  };

  return (
    <Card
      className={`voting-card ${hasVoted ? 'voting-card--voted' : ''} ${selected ? 'voting-card--selected' : ''} ${isVotedParty ? 'voting-card--voted-party' : ''}`}
      variant="elevated"
    >
      <div className="voting-card__header">
        <div className="voting-card__symbol">{getPartySymbol(candidate.name)}</div>
        <div className="voting-card__info">
          <h3 className="voting-card__name">{translateParty(candidate.name, t)}</h3>
          <p className="voting-card__party">{translateCandidateText('Political Party', t)}</p>
        </div>
      </div>

      <div className="voting-card__body">
        <p className="voting-card__bio">{translateCandidateText('Vote for', t)} {translateParty(candidate.name, t)} {translateCandidateText('to support their vision for Nepal\'s future', t)}.</p>
      </div>

      <div className="voting-card__footer">
        {isVotedParty ? (
          <div className="voting-card__status voting-card__status--voted">
            <span className="voting-card__status-icon">✓</span>
            <span>{translateCandidateText('You voted for this party', t)}</span>
          </div>
        ) : hasVoted ? (
          <div className="voting-card__status voting-card__status--disabled">
            <span className="voting-card__status-icon">✗</span>
            <span>{translateCandidateText('Voting completed', t)}</span>
          </div>
        ) : (
          <Button
            variant={selected ? 'secondary' : 'primary'}
            onClick={handleVote}
            disabled={isSubmitting || selected}
            loading={isSubmitting && selected}
            className="voting-card__button"
          >
            {selected ? translateCandidateText('Vote Submitted', t) : translateCandidateText('Vote for this Party', t)}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default VotingCard;
