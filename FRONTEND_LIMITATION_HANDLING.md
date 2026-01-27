# Frontend Updates - OneToOneField Limitation Handling

## Overview

The backend's Vote model uses `OneToOneField(User)`, which means each user can only have ONE vote record total. This prevents users from voting for both FPTP (candidate) and PR (party) in the same session.

**The user said: "don't change backend"** - so the frontend has been updated to gracefully handle this limitation.

---

## Frontend Changes

### 1. VotingService - New Methods

**File**: `src/services/votingService.js`

Added two new methods to check voting status:

```javascript
/**
 * Check if user has already voted (any type)
 * Due to OneToOneField in backend Vote model, each user can only vote once total
 * @returns {Promise<boolean>} - True if user has voted
 */
async hasUserVoted() {
  try {
    const history = await this.getVotingHistory();
    return Array.isArray(history) && history.length > 0;
  } catch (e) {
    console.error('Error checking vote status:', e);
    return false;
  }
}

/**
 * Get vote type that user has already submitted (if any)
 * @returns {Promise<string|null>} - 'FPTP', 'PR', or null
 */
async getUserVoteType() {
  try {
    const history = await this.getVotingHistory();
    if (Array.isArray(history) && history.length > 0) {
      return history[0].vote_type || null;
    }
  } catch (e) {
    console.error('Error checking vote type:', e);
  }
  return null;
}
```

### 2. VoteWizard Component - Enhanced Error Handling

**File**: `src/pages/VoteWizard.jsx`

Updated the `confirmVote()` function to:

- **Pre-check voting status** before allowing vote submission
- **Detect OneToOneField errors** from backend (IntegrityError, UNIQUE constraint)
- **Show user-friendly messages** explaining the limitation
- **Redirect to completion step** if user has already voted

```javascript
const confirmVote = async () => {
  // ... code ...
  
  // Check if user has already voted (OneToOneField limitation on backend)
  const hasVoted = await votingService.hasUserVoted();
  if (hasVoted) {
    setError('You have already voted. Due to system design, each voter can only submit one vote (either FPTP or PR, not both).');
    setCurrentStep(3); // Go to completion step
    return;
  }
  
  // ... submit vote logic ...
  
  // Handle backend errors
  if (errorMessage.includes('already') || errorMessage.includes('IntegrityError') || errorMessage.includes('UNIQUE constraint failed')) {
    setError('You have already voted. Each voter can only submit one vote (either FPTP or PR, not both). This is due to a backend system limitation.');
    setCurrentStep(3);
  }
};
```

### 3. VoteWizard Component - UI Updates for Step 2

**File**: `src/pages/VoteWizard.jsx`

Updated Step 2 (PR Voting) display to:

- **Show warning message** if user already voted for FPTP
- **Disable PR voting cards** and show explanation
- **Allow navigation to completion** without requiring PR vote

```jsx
{currentStep === 2 && (
  <div className="vote-step">
    <div className="step-header">
      <h2>{t('voting.step2Title', 'Step 2: Select Your Party (PR)')}</h2>
      {fptpVoted && !prVoted && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          borderRadius: '4px',
          color: '#856404'
        }}>
          <strong>Note:</strong> You have already voted for a candidate (FPTP). 
          Due to a system limitation, you can only submit one vote per session 
          (either FPTP or PR, not both).
        </div>
      )}
    </div>
    
    <div className="parties-grid">
      {fptpVoted && !prVoted ? (
        <div style={{...disabledStyle}}>
          <p>You have already cast your vote. The system allows one vote per session.</p>
        </div>
      ) : (
        // Show party voting cards
      )}
    </div>
  </div>
)}
```

---

## User Experience Impact

### Before Frontend Updates
- ❌ User votes for candidate (FPTP)
- ❌ User tries to vote for party (PR)
- ❌ Backend returns 500 IntegrityError
- ❌ User sees confusing error message

### After Frontend Updates
- ✅ User votes for candidate (FPTP)
- ✅ Frontend checks if user already voted
- ✅ Frontend displays clear message about limitation
- ✅ UI disables second vote option
- ✅ User can proceed to completion
- ✅ OR backend error caught and handled gracefully

---

## Tested Scenarios

### Test 1: Vote After Already Voted
```
[OK] User can register
[OK] User can login
[OK] User can submit FPTP vote
[OK] User CANNOT submit PR vote (backend prevents it)
[OK] Frontend displays helpful error message
```

### Test 2: New Methods Work
```
[OK] hasUserVoted() returns true after voting
[OK] hasUserVoted() returns false before voting
[OK] getUserVoteType() returns vote type submitted
```

---

## Code Quality

- **No breaking changes** - All existing functionality preserved
- **Backward compatible** - Works with old vote records
- **Error resilient** - Catches and logs errors gracefully
- **User-friendly** - Clear messages about limitations
- **Well-documented** - JSDoc comments on new methods

---

## System Limitation Explained

### Why This Limitation Exists

The `Vote` model in backend:
```python
class Vote(models.Model):
    voter = models.OneToOneField(User, ...)  # ← Each user can have only ONE vote record
    vote_type = models.CharField(choices=[("FPTP", ...), ("PR", ...)])
    candidate = models.ForeignKey(Candidate, null=True, ...)
    party = models.ForeignKey(Party, null=True, ...)
```

**Problem**: `OneToOneField` means each user can only have one Vote record, but the voting logic supports per-type checking.

**Solution**: The frontend now handles this by:
1. Checking if user already voted before submission
2. Showing helpful UI messages
3. Gracefully handling backend errors

**Proper Fix** (would require backend changes):
- Change to `ForeignKey` to allow multiple votes
- OR create separate `FPTPVote` and `PRVote` tables
- OR change the application logic to allow only one vote per session

---

## Testing

Run the test suite:
```bash
python test_frontend_limitation.py
```

Expected output:
```
======================================================================
ALL TESTS PASSED!
======================================================================

The frontend has been updated to handle the OneToOneField limitation:
  1. New methods in VotingService to check voting status
  2. Vote submission checks if user already voted
  3. UI displays helpful message about limitation
  4. Backend errors are caught and handled gracefully
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/services/votingService.js` | Added `hasUserVoted()` and `getUserVoteType()` methods |
| `src/pages/VoteWizard.jsx` | Enhanced vote submission logic with pre-checks and error handling |
| `src/pages/VoteWizard.jsx` | Updated UI for Step 2 to show limitation message and disable second vote |

---

## Summary

The frontend has been successfully updated to handle the backend's OneToOneField limitation without modifying the backend code. Users now get a clear, helpful experience when encountering the single-vote-per-session restriction.
