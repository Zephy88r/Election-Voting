import React, { useState } from 'react';
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
const VotingCard = ({ candidate, hasVoted, onVote, isSubmitting }) => {
  const [selected, setSelected] = useState(false);

  const handleVote = () => {
    if (!hasVoted && !isSubmitting) {
      setSelected(true);
      onVote(candidate.id);
    }
  };

  // Party symbols mapping
  const getPartySymbol = (partyName) => {
    const symbols = {
      'CPN UML': '☭',
      'Nepali Congress': '🌾',
      'Rastra Swatantra Party (RSP)': '🏛️',
      'CPN UML (Moist)': '⚡'
    };
    return symbols[partyName] || '🏛️';
  };

  return (
    <Card
      className={`voting-card ${hasVoted ? 'voting-card--voted' : ''} ${selected ? 'voting-card--selected' : ''}`}
      variant="elevated"
    >
      <div className="voting-card__header">
        <div className="voting-card__symbol">{getPartySymbol(candidate.name)}</div>
        <div className="voting-card__info">
          <h3 className="voting-card__name">{candidate.name}</h3>
          <p className="voting-card__party">Political Party</p>
        </div>
      </div>

      <div className="voting-card__body">
        <p className="voting-card__bio">Vote for {candidate.name} to support their vision for Nepal's future.</p>
      </div>

      <div className="voting-card__footer">
        {hasVoted ? (
          <div className="voting-card__status">
            <span className="voting-card__status-icon">✓</span>
            <span>You have already voted</span>
          </div>
        ) : (
          <Button
            variant={selected ? 'secondary' : 'primary'}
            onClick={handleVote}
            disabled={isSubmitting || selected}
            loading={isSubmitting && selected}
            className="voting-card__button"
          >
            {selected ? 'Vote Submitted' : 'Vote for this Party'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default VotingCard;
