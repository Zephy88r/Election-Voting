import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { votingService } from '../../services/votingService';
import { notificationService } from '../../services/notificationService';
import './ProvincePage.css';

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
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPartyId, setVotedPartyId] = useState(null);
  const [parties, setParties] = useState([]);

  // Confirm vote modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPartyId, setPendingPartyId] = useState(null);

  const userProvinceName = normalizeProvinceName(user);
  const hasAccess = userProvinceName === requiredProvinceName;

  // Per-user vote lock key
  const userKey = String(user?.id || user?.voterId || user?.username || user?.email || 'anonymous');

  useEffect(() => {
    const init = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch parties from backend
        const partiesData = await votingService.getParties();
        setParties(partiesData || []);
        
        // Check voting status
        const status = await votingService.hasVotedInProvince(provinceId, userKey);
        if (typeof status === 'boolean') {
          setHasVoted(status);
          setVotedPartyId(null);
        } else {
          setHasVoted(Boolean(status?.voted));
          setVotedPartyId(status?.partyId ?? null);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load voting data');
        setHasVoted(false);
        setVotedPartyId(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasAccess, provinceId]);

  const requestVote = (partyId) => {
    setPendingPartyId(partyId);
    setConfirmOpen(true);
  };

  const cancelVote = () => {
    setConfirmOpen(false);
    setPendingPartyId(null);
  };

  const confirmVote = async () => {
    const partyId = pendingPartyId;
    if (!partyId) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const party = parties.find((p) => p.id === partyId);
      if (!party) throw new Error('Party not found');

      const res = await votingService.submitPartyVote(partyId, provinceId, userKey);

      setHasVoted(true);
      setVotedPartyId(partyId);
      setSuccess(res?.message || `Vote submitted for ${party.name}.`);

      notificationService.createNotification({
        type: 'success',
        title: 'Vote Submitted',
        message: `Your vote for ${party.name} has been recorded.`,
        userId: user?.id || 'api-user',
      });

      setConfirmOpen(false);
      setPendingPartyId(null);
    } catch (e) {
      setError(e?.message || 'Failed to submit vote');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Confirm Vote Modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={cancelVote}
        >
          <div
            style={{
              width: 'min(560px, 100%)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.90))',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 22px 70px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(14px)',
              padding: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--color-text-primary)' }}>{t('confirmVote')}</div>
                <div style={{ marginTop: 4, color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                  {t('confirmMessage')}
                </div>
              </div>
              <div style={{ fontSize: 22 }}>🗳️</div>
            </div>

            <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: 'rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('selectedParty')}</div>
              <div style={{ marginTop: 4, fontWeight: 900, color: 'var(--color-text-primary)' }}>
                {parties.find((p) => p.id === pendingPartyId)?.name || '—'}
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={cancelVote} disabled={submitting}>
                {t('cancel')}
              </Button>
              <Button variant="primary" onClick={confirmVote} disabled={submitting} loading={submitting}>
                {t('yesCastVote')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="provinceShell">
        <div className="provinceWrap">
          {!hasAccess ? (
            <div className="accessDenied">
              <h2>{t('accessDenied').split(':')[0]}</h2>
              <p style={{ margin: '0 0 14px', color: 'var(--color-text-secondary)' }}>
                {t('onlyVoteInRegistered')} <b>{userProvinceName || t('yourRegisteredProvince')}</b>.
              </p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                {t('backToDashboard')}
              </Button>
            </div>
          ) : loading ? (
            <div className="loadingBox">
              <LoadingSpinner size="lg" />
              <div>{t('preparingBallot')}</div>
            </div>
          ) : (
            <div className="provinceHero">
              <div className="provinceHeroTop">
                <div className="provinceTitleBlock">
                  <h1 className="provinceTitle">{provinceLabel} — {t('provincialBallot')}</h1>
                  <p className="provinceSubtitle">{t('selectParty')}</p>
                </div>

                <div className="provinceBadges">
                  <span className={`pill pillStrong`}>{t('prVote')}</span>
                  <span className={`pill ${hasVoted ? 'pillOk' : 'pillWarn'}`}>
                    {hasVoted ? t('alreadyVoted') : t('notVotedYet')}
                  </span>
                  <span className="pill">{t('province')}: {requiredProvinceName}</span>
                </div>
              </div>

              <div className="provinceDivider" />

              <div className="provinceInfoRow">
                <div className="provinceInfoCard">
                  <h3>{t('howItWorks')}</h3>
                  <p>
                    Choose a party and submit your vote. The system enforces <b>one (1)</b> party vote only.
                    {heroHint ? ` ${heroHint}` : ''}
                  </p>
                </div>

                <div className="provinceInfoCard">
                  <h3>{t('status')}</h3>
                  <p>
                    {hasVoted
                      ? `${t('votedFor')} ${votedPartyId ?? '—'}`
                      : t('notVoted')}
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

                  // Map party symbols for better display
                  const getPartySymbol = (symbol, name) => {
                    const symbolMap = {
                      'NC': '🌳',
                      'UML': '☀️', 
                      'UMLM': '☀️',
                      'MCP': '⚒️',
                      'JD': '⚖️',
                      'SP': '🌾',
                      'RSP': '🔔'
                    };
                    return symbolMap[symbol] || symbol || '🏛️';
                  };

                  // Generate party tagline based on name
                  const getPartyTagline = (name) => {
                    const taglines = {
                      'Nepali Congress': 'Democracy, inclusion, and institutional stability.',
                      'CPN-UML': 'Economic growth, governance reform, and national development.',
                      'CPN UML': 'Economic growth, governance reform, and national development.',
                      'CPN-Maoist': 'Social justice, equitable development, and public welfare.',
                      'CPN UML (Moist)': 'Social justice, equitable development, and public welfare.',
                      'Janata Dal': 'Champion of social justice and equality.',
                      'Socialist Party': 'Workers rights and social democracy.',
                      'Rastra Swatantra Party (RSP)': 'Transparency, meritocracy, and youth-led transformation.'
                    };
                    return taglines[name] || 'Working for the people of Nepal.';
                  };

                  const getPartyIdeology = (name) => {
                    const ideologies = {
                      'Nepali Congress': 'Centrist',
                      'CPN-UML': 'Center-left',
                      'CPN UML': 'Center-left', 
                      'CPN-Maoist': 'Left',
                      'CPN UML (Moist)': 'Left',
                      'Janata Dal': 'Center-left',
                      'Socialist Party': 'Left',
                      'Rastra Swatantra Party (RSP)': 'Reformist'
                    };
                    return ideologies[name] || 'Democratic';
                  };

                  const getPartyFocus = (name) => {
                    const focuses = {
                      'Nepali Congress': 'Democracy',
                      'CPN-UML': 'Development',
                      'CPN UML': 'Development',
                      'CPN-Maoist': 'Welfare', 
                      'CPN UML (Moist)': 'Welfare',
                      'Janata Dal': 'Justice',
                      'Socialist Party': 'Workers',
                      'Rastra Swatantra Party (RSP)': 'Governance'
                    };
                    return focuses[name] || 'Progress';
                  };

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
                            <div className="partyMark">{getPartySymbol(p.symbol, p.name)}</div>
                            <div>
                              <h3 className="partyName">{p.name}</h3>
                              <p className="partyTagline">{getPartyTagline(p.name)}</p>
                            </div>
                          </div>

                          <div>
                            <Button
                              variant={isSelected ? 'secondary' : 'primary'}
                              disabled={disabled}
                              loading={submitting && !hasVoted}
                              onClick={() => requestVote(p.id)}
                            >
                              {hasVoted ? (isSelected ? t('voted') : t('locked')) : t('vote')}
                            </Button>
                          </div>
                        </div>

                        <div className="partyFooter">
                          <div className="partyMeta">
                            <span className="miniPill">Ideology: {getPartyIdeology(p.name)}</span>
                            <span className="miniPill">Focus: {getPartyFocus(p.name)}</span>
                            <span className="miniPill">Ballot ID: {p.id}</span>
                          </div>
                        </div>

                        <div className="voteHint">
                          {t('tip')}
                        </div>
                      </div>
                    </div>
                  );
                })}}
              </div>

              <div className="provinceDivider" />

              <div className="provinceActions">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>{t('back')}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
