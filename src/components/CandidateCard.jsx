import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import './CandidateCard.css';

const CandidateCard = ({ 
  candidate, 
  hasVoted, 
  onVote, 
  isSubmitting, 
  votedCandidateId,
  isSelected,
  onSelect 
}) => {
  const isVotedCandidate = votedCandidateId === candidate.id;
  const isDisabled = hasVoted && !isVotedCandidate;

  const handleSelect = () => {
    if (!hasVoted && !isSubmitting) {
      onSelect(candidate.id);
    }
  };

  const handleVote = () => {
    if (!hasVoted && !isSubmitting && isSelected) {
      onVote(candidate.id);
    }
  };

  return (
    <div
      className={`candidate-card ${hasVoted ? 'candidate-card--voted' : ''} ${isSelected ? 'candidate-card--selected' : ''} ${isVotedCandidate ? 'candidate-card--voted-candidate' : ''}`}
      onClick={handleSelect}
    >
      <Card variant="elevated" className="candidate-card__inner">
        <div className="candidate-card__header">
          <div className="candidate-card__symbol">{candidate.symbol || '👤'}</div>
          <div className="candidate-card__info">
            <h3 className="candidate-card__name">{candidate.name}</h3>
            <p className="candidate-card__party">{candidate.party}</p>
          </div>
        </div>

        <div className="candidate-card__body">
          <p className="candidate-card__bio">{candidate.bio || `Vote for ${candidate.name} to represent your constituency.`}</p>
        </div>

        <div className="candidate-card__footer">
          {isVotedCandidate ? (
            <div className="candidate-card__status candidate-card__status--voted">
              <span className="candidate-card__status-icon">✓</span>
              <span>You voted for this candidate</span>
            </div>
          ) : hasVoted ? (
            <div className="candidate-card__status candidate-card__status--disabled">
              <span className="candidate-card__status-icon">✗</span>
              <span>Voting completed</span>
            </div>
          ) : (
            <Button
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={(e) => {
                e.stopPropagation();
                handleVote();
              }}
              disabled={!isSelected || isSubmitting}
              loading={isSubmitting && isSelected}
              className="candidate-card__button"
            >
              {isSelected ? 'Vote for this Candidate' : 'Select Candidate'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CandidateCard;