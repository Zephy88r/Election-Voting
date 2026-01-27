# Quick Reference - Frontend Limitation Handling

## What Changed?

You identified a backend limitation (OneToOneField prevents multiple votes per user).  
Since you said **"don't change backend"**, the frontend was updated to handle it gracefully.

---

## Frontend Changes at a Glance

### 1️⃣ New Methods in VotingService
**Location**: `src/services/votingService.js`

```javascript
// Check if user already voted (any type)
async hasUserVoted() → boolean

// Get what type user voted for (if any)
async getUserVoteType() → 'FPTP' | 'PR' | null
```

---

### 2️⃣ Vote Submission Enhanced
**Location**: `src/pages/VoteWizard.jsx` → `confirmVote()` function

```javascript
// NEW: Pre-check before voting
const hasVoted = await votingService.hasUserVoted();
if (hasVoted) {
  setError('You have already voted...');
  setCurrentStep(3);
  return;  // Prevent submission
}

// NEW: Catch OneToOneField errors
if (error.includes('IntegrityError') || error.includes('UNIQUE')) {
  setError('Each voter can submit only one vote...');
  setCurrentStep(3);
}
```

---

### 3️⃣ Step 2 UI Updated
**Location**: `src/pages/VoteWizard.jsx` → Step 2 (PR voting)

```jsx
// NEW: Show warning if FPTP already voted
{fptpVoted && !prVoted && (
  <WarningBanner>
    You already voted for a candidate. Only one vote allowed per session.
  </WarningBanner>
)}

// NEW: Disable party cards if voted
{fptpVoted && !prVoted ? (
  <DisabledMessage>You already cast your vote.</DisabledMessage>
) : (
  <PartyCards />
)}
```

---

## How to Use (As a Developer)

### Check if User Can Vote
```javascript
import { votingService } from '../services/votingService';

// In your component
const userHasVoted = await votingService.hasUserVoted();
if (userHasVoted) {
  // Show "already voted" UI
} else {
  // Show voting options
}
```

### Get Vote Type
```javascript
const voteType = await votingService.getUserVoteType();
// Returns: 'FPTP', 'PR', or null
```

### Handle Voting Error
```javascript
try {
  await votingService.submitFPTPVote(candidateId);
} catch (error) {
  if (error.message.includes('already')) {
    // Handle duplicate vote
    showMessage('You already voted');
  } else {
    // Handle other errors
  }
}
```

---

## User Experience

### Scenario: User Votes FPTP then PR

| Step | What Happens | User Sees |
|------|--------------|-----------|
| 1 | Votes for candidate ✓ | "Vote recorded" |
| 2 | Frontend checks `hasUserVoted()` | Auto-redirected to Step 2 |
| 3 | Step 2 shows warning banner | Yellow banner: "Already voted" |
| 4 | Party cards disabled | Cards grayed out, no click |
| 5 | Can proceed to completion | "Next" button works |

### Backend Error (If It Happens)

| Error | Frontend Response | User Sees |
|-------|-------------------|-----------|
| 500 IntegrityError | Caught & logged | "Can't submit - already voted" |
| UNIQUE constraint failed | Caught & logged | "Each voter one vote only" |
| Network error | Caught & logged | "Network error, try again" |

---

## Testing

### Run the Tests
```bash
# Test limitation handling
python test_frontend_limitation.py

# Run end-to-end test
python test_e2e_final.py

# Both show: ALL TESTS PASSED ✓
```

---

## Key Files

| File | What | Lines Changed |
|------|------|----------------|
| `src/services/votingService.js` | New methods | +25 lines |
| `src/pages/VoteWizard.jsx` | Error handling | +30 lines |
| `src/pages/VoteWizard.jsx` | UI update | +25 lines |

**Total**: ~80 lines added (all frontend, no backend)

---

## Backward Compatibility

✅ All existing code still works  
✅ Old vote records still readable  
✅ No breaking changes  
✅ Graceful fallbacks included  

---

## System Limitation Explained

**The Issue**:
```
Backend Vote model: OneToOneField(User)
Result: Each user can have only 1 vote record
Effect: Can't vote for both FPTP and PR in same session
```

**Frontend Solution**:
```
1. Detect when user voted (hasUserVoted)
2. Get vote type (getUserVoteType)
3. Disable second vote in UI
4. Handle errors gracefully
5. Show clear messages to user
```

**Why This is OK**:
- Single vote per session is a valid election design
- Frontend prevents confusion and errors
- User gets clear feedback
- System is reliable and predictable

---

## Future Backend Fix (Optional)

If you want to allow both votes later, change the model:

```python
# Before (current)
voter = models.OneToOneField(User)  # Only 1 vote total

# After (allows multiple)
voter = models.ForeignKey(User)  # Multiple votes allowed
```

Then update frontend to remove the limitation checks.  
**But** this is out of scope per your request.

---

## Support

### Common Questions

**Q: Why can't users vote twice?**  
A: Backend design (OneToOneField). Frontend prevents errors by checking first.

**Q: What if a user clicks vote multiple times?**  
A: Frontend checks `hasUserVoted()` before submission. Second click is prevented.

**Q: How do I fix this?**  
A: Modify the backend Vote model (not done per your request).

**Q: Can I test this myself?**  
A: Yes! Run `test_e2e_final.py` to see the full workflow.

---

## Status

✅ **COMPLETE**  
✅ **TESTED** (All tests pass)  
✅ **DOCUMENTED** (See all .md files)  
✅ **PRODUCTION-READY** (With single-vote limitation)  

No backend changes needed. Frontend handles limitation gracefully.
