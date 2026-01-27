import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateName, translateParty, translateCandidateText, translateCandidateBio } from '../utils/translationUtils';
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
  const { t } = useLanguage();
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
            <h3 className="candidate-card__name">{translateName(candidate.name, t)}</h3>
            <p className="candidate-card__party">{translateParty(candidate.party, t)}</p>
          </div>
        </div>

        <div className="candidate-card__body">
          <p className="candidate-card__bio">{translateCandidateBio(candidate.bio, candidate.name, t)}</p>
        </div>

        <div className="candidate-card__footer">
          {isVotedCandidate ? (
            <div className="candidate-card__status candidate-card__status--voted">
              <span className="candidate-card__status-icon">✓</span>
              <span>{translateCandidateText('You voted for this candidate', t)}</span>
            </div>
          ) : hasVoted ? (
            <div className="candidate-card__status candidate-card__status--disabled">
              <span className="candidate-card__status-icon">✗</span>
              <span>{translateCandidateText('Voting completed', t)}</span>
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
              {isSelected ? translateCandidateText('Vote for this Candidate', t) : translateCandidateText('Select Candidate', t)}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CandidateCard;