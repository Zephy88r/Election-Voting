import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import { useAuth } from '../../contexts/AuthContext';
import { votingService } from '../../services/votingService';
import { notificationService } from '../../services/notificationService';
import './ProvincePage.css';

const PARTY_LIST = [
  {
    id: 1,
    name: 'CPN UML',
    symbol: '☀️',
    tagline: 'Economic growth, governance reform, and national development.',
    ideology: 'Center-left',
    focus: 'Development',
  },
  {
    id: 2,
    name: 'Rastra Swotantra Party (RSP)',
    symbol: '🗳️',
    tagline: 'Transparency, meritocracy, and youth-led transformation.',
    ideology: 'Reformist',
    focus: 'Governance',
  },
  {
    id: 3,
    name: 'Nepali Congress',
    symbol: '🌾',
    tagline: 'Democracy, inclusion, and institutional stability.',
    ideology: 'Centrist',
    focus: 'Democracy',
  },
  {
    id: 4,
    name: 'CPN UML (Maoist)',
    symbol: '⚒️',
    tagline: 'Social justice, equitable development, and public welfare.',
    ideology: 'Left',
    focus: 'Welfare',
  },
];

function normalizeProvinceName(user) {
  const p = user?.province;
  if (!p) return null;
  return typeof p === 'string' ? p : p?.name;
}

export default function ProvinceTemplate({
  provinceId,
  provinceLabel,
  requiredProvinceName,
  heroHint,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPartyId, setVotedPartyId] = useState(null);

  const userProvinceName = normalizeProvinceName(user);
  const hasAccess = userProvinceName === requiredProvinceName;

  const parties = useMemo(() => PARTY_LIST, []);

  useEffect(() => {
    const init = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const status = await votingService.hasVotedInProvince(provinceId);
        if (typeof status === 'boolean') {
          setHasVoted(status);
          setVotedPartyId(null);
        } else {
          setHasVoted(Boolean(status?.voted));
          setVotedPartyId(status?.partyId ?? null);
        }
      } catch {
        setHasVoted(false);
        setVotedPartyId(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasAccess, provinceId]);

  const handleVote = async (partyId) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const party = parties.find((p) => p.id === partyId);
      if (!party) throw new Error('Party not found');

      const res = await votingService.submitPartyVote(partyId, provinceId);

      setHasVoted(true);
      setVotedPartyId(partyId);
      setSuccess(res?.message || `Vote submitted for ${party.name}.`);

      notificationService.createNotification({
        type: 'success',
        title: 'Vote Submitted',
        message: `Your vote for ${party.name} has been recorded.`,
        userId: user?.id || 'api-user',
      });
    } catch (e) {
      setError(e?.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="provinceShell">
        <div className="provinceWrap">
          {!hasAccess ? (
            <div className="accessDenied">
              <h2>Access Denied</h2>
              <p style={{ margin: '0 0 14px', color: 'var(--color-text-secondary)' }}>
                You can only vote in <b>{userProvinceName || 'your registered province'}</b>.
              </p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          ) : loading ? (
            <div className="loadingBox">
              <LoadingSpinner size="lg" />
              <div>Preparing ballot…</div>
            </div>
          ) : (
            <div className="provinceHero">
              <div className="provinceHeroTop">
                <div className="provinceTitleBlock">
                  <h1 className="provinceTitle">{provinceLabel} — Provincial Ballot</h1>
                  <p className="provinceSubtitle">Select exactly one party. Your choice is final.</p>
                </div>

                <div className="provinceBadges">
                  <span className={`pill pillStrong`}>PR Vote</span>
                  <span className={`pill ${hasVoted ? 'pillOk' : 'pillWarn'}`}>
                    {hasVoted ? 'Already Voted' : 'Not Voted Yet'}
                  </span>
                  <span className="pill">Province: {requiredProvinceName}</span>
                </div>
              </div>

              <div className="provinceDivider" />

              <div className="provinceInfoRow">
                <div className="provinceInfoCard">
                  <h3>How it works</h3>
                  <p>
                    Choose a party and submit your vote. The system enforces <b>one (1)</b> party vote only.
                    {heroHint ? ` ${heroHint}` : ''}
                  </p>
                </div>

                <div className="provinceInfoCard">
                  <h3>Status</h3>
                  <p>
                    {hasVoted
                      ? `Voted for party ID: ${votedPartyId ?? '—'}`
                      : 'You have not voted yet.'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message={success} />}
              </div>

              <div className="provinceGrid">
                {parties.map((p) => {
                  const isSelected = votedPartyId === p.id;
                  const disabled = submitting || hasVoted;

                  return (
                    <div
                      key={p.id}
                      className="partyCard"
                      style={{
                        outline: isSelected ? '2px solid rgba(40,167,69,0.55)' : 'none',
                      }}
                    >
                      <div className="partyCardInner">
                        <div className="partyHeader">
                          <div className="partyIdentity">
                            <div className="partyMark">{p.symbol}</div>
                            <div>
                              <h3 className="partyName">{p.name}</h3>
                              <p className="partyTagline">{p.tagline}</p>
                            </div>
                          </div>

                          <div>
                            <Button
                              variant={isSelected ? 'secondary' : 'primary'}
                              disabled={disabled}
                              loading={submitting && !hasVoted}
                              onClick={() => handleVote(p.id)}
                            >
                              {hasVoted ? (isSelected ? 'Voted' : 'Locked') : 'Vote'}
                            </Button>
                          </div>
                        </div>

                        <div className="partyFooter">
                          <div className="partyMeta">
                            <span className="miniPill">Ideology: {p.ideology}</span>
                            <span className="miniPill">Focus: {p.focus}</span>
                            <span className="miniPill">Ballot ID: {p.id}</span>
                          </div>
                        </div>

                        <div className="voteHint">
                          Tip: Double-check your choice. After submitting, you cannot vote again.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="provinceDivider" />

              <div className="provinceActions">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
