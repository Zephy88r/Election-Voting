import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './ElectoralModal.css';

function ElectoralModal({ district, onClose }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [electoralAreas, setElectoralAreas] = useState([]);
  const [selectedElectoralArea, setSelectedElectoralArea] = useState(null);
  const [parties, setParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [step, setStep] = useState(1); // 1: select electoral area, 2: vote, 3: confirmation

  useEffect(() => {
    const fetchElectoralAreas = async () => {
      try {
        const response = await fetch(`/elections/api/electoral-areas-by-district/?district_id=${district.id}`);
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setElectoralAreas(data);
        }
      } catch (error) {
        console.error('Error fetching electoral areas:', error);
      }
    };

    if (district?.id) {
      fetchElectoralAreas();
    }
  }, [district]);

  useEffect(() => {
    if (selectedElectoralArea) {
      const fetchPartiesAndCandidates = async () => {
        try {
          const [partiesResponse, candidatesResponse] = await Promise.all([
            fetch('/api/parties/'),
            fetch(`/api/candidates/?electoral_area_id=${selectedElectoralArea.id}`),
          ]);
          const partiesData = await partiesResponse.json();
          const candidatesData = await candidatesResponse.json();
          setParties(partiesData);
          setCandidates(candidatesData);
        } catch (error) {
          console.error('Error fetching parties and candidates:', error);
        }
      };

      fetchPartiesAndCandidates();
    }
  }, [selectedElectoralArea]);

  const userElectoralAreaName = user?.electoral_area?.name;

  const isElectoralAreaAccessible = (electoralArea) => {
    if (!userElectoralAreaName) return false;
    return String(electoralArea.name).toLowerCase().trim() === String(userElectoralAreaName).toLowerCase().trim();
  };

  const handleElectoralAreaSelect = (electoralArea) => {
    if (!isElectoralAreaAccessible(electoralArea)) {
      alert(t('accessDenied', { electoralAreaName: userElectoralAreaName }));
      return;
    }
    setSelectedElectoralArea(electoralArea);
    setStep(2);
  };

  const handleVote = async () => {
    if (!selectedParty || !selectedCandidate) {
      alert(t('pleaseSelectPartyAndCandidate'));
      return;
    }

    try {
      const response = await fetch('/api/vote/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}', // This needs to be handled properly
        },
        body: JSON.stringify({
          party_id: selectedParty.id,
          candidate_id: selectedCandidate.id,
        }),
      });

      if (response.ok) {
        setStep(3);
      } else {
        const errorData = await response.json();
        alert(t('voteFailed', { error: errorData.error }));
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert(t('voteFailed', { error: error.message }));
    }
  };

  const renderStep1 = () => (
    <>
      <h2>{t('selectYourElectoralArea')}</h2>
      <div className="electoral-area-grid">
        {electoralAreas.map((area) => {
          const isAccessible = isElectoralAreaAccessible(area);
          const isDisabled = !isAccessible;
          return (
            <div
              key={area.id}
              className={`electoral-area-card ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && handleElectoralAreaSelect(area)}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              aria-disabled={isDisabled}
            >
              <h3>{area.name}</h3>
              {isDisabled && <p>{t('accessRestricted')}</p>}
            </div>
          );
        })}
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2>{t('castYourVote')}</h2>
      <div className="voting-section">
        <div className="parties-section">
          <h3>{t('parties')}</h3>
          <div className="parties-grid">
            {parties.map((party) => (
              <div
                key={party.id}
                className={`party-card ${selectedParty?.id === party.id ? 'selected' : ''}`}
                onClick={() => setSelectedParty(party)}
              >
                <img src={party.symbol} alt={party.name} />
                <p>{party.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="candidates-section">
          <h3>{t('candidates')}</h3>
          <div className="candidates-list">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`candidate-item ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                onClick={() => setSelectedCandidate(candidate)}
              >
                <p>{candidate.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleVote} className="vote-button">{t('submitVote')}</button>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2>{t('voteCastedSuccessfully')}</h2>
      <button onClick={onClose} className="close-button">{t('close')}</button>
    </>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button-modal">X</button>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}

export default ElectoralModal;