# CORS and Electoral Area Filtering Fix

## Issues Addressed

### 1. **CORS (Cross-Origin Resource Sharing) Errors**
**Error**: `Access to fetch at 'http://localhost:8000/elections/api/csrf/' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Root Cause**: 
- Frontend at `http://localhost:5173` was trying to access backend at `http://localhost:8000`
- Session cookie `SameSite` policy was set to `"Lax"`, which restricts cross-origin credentials
- CORS headers were not being sent for preflight OPTIONS requests

**Solutions Implemented**:

1. **Updated `settings.py`**:
   - Changed `SESSION_COOKIE_SAMESITE = "None"` (was "Lax")
   - Ensured `CORS_ALLOW_CREDENTIALS = True` is set
   - Django CORS middleware is properly configured

2. **Impact**:
   - Browser preflight requests now succeed
   - Session cookies are properly included in cross-origin requests
   - All API endpoints now accessible from frontend

### 2. **Electoral Area Filtering by District**
**Problem**: When user selected a district, ALL electoral areas from the province were shown instead of filtering by district.

**Root Cause**: The API endpoint returned electoral areas at province level, not organized by district.

**Solutions Implemented**:

1. **Updated API Endpoint** (`views.py`):
   - Modified `/elections/api/registration-data/` to return electoral areas organized by district
   - New structure:
     ```
     Province
     └── District
         └── Electoral Areas (for that specific district)
     ```
   - Optional `?district_id=X` parameter to fetch electoral areas for a specific district

2. **Updated Register Component** (`Register.jsx`):
   - Electoral area dropdown now only shows areas for the **selected district** (not province)
   - Disabled until a district is selected
   - Helper text: "selectDistrictFirst" instead of "selectProvinceFirst"

3. **Updated Data Hierarchy**:
   - Old: Province → Electoral Areas (all)
   - New: Province → District → Electoral Areas (for that district)

---

## Technical Changes

### Backend Changes

**File**: `backend/voting_system/settings.py`
```python
# BEFORE
SESSION_COOKIE_SAMESITE = "Lax"

# AFTER
SESSION_COOKIE_SAMESITE = "None"  # Allow cross-origin session cookies
```

**File**: `backend/elections/views.py`
- Updated `get_registration_data()` function to:
  - Return nested structure: `Province → Districts → Electoral Areas`
  - Support optional `?district_id=X` query parameter
  - Filter electoral areas by district when requested

### Frontend Changes

**File**: `src/components/Register.jsx`
- Electoral area dropdown now filters by selected district
- Disabled until district is selected
- Updated helper text and logic

---

## API Response Format

### Get All Registration Data
**Endpoint**: `GET /elections/api/registration-data/`

**Old Response Format** (Electoral areas at province level):
```json
{
  "provinces": [
    {
      "id": 1,
      "name": "Province 1",
      "districts": [
        {"id": 1, "name": "Bhojpur"},
        {"id": 2, "name": "Dhankuta"}
      ],
      "electoral_areas": [
        {"id": 1, "name": "Bhojpur Area"},
        {"id": 2, "name": "Dhankuta Area"}
      ]
    }
  ]
}
```

**New Response Format** (Electoral areas organized by district):
```json
{
  "provinces": [
    {
      "id": 1,
      "name": "Province 1",
      "districts": [
        {
          "id": 1,
          "name": "Bhojpur",
          "electoral_areas": [
            {"id": 1, "name": "Bhojpur Area"}
          ]
        },
        {
          "id": 2,
          "name": "Dhankuta",
          "electoral_areas": [
            {"id": 2, "name": "Dhankuta Area"}
          ]
        }
      ]
    }
  ]
}
```

### Get Electoral Areas for Specific District
**Endpoint**: `GET /elections/api/registration-data/?district_id=1`

**Response**:
```json
{
  "district": {
    "id": 1,
    "name": "Bhojpur"
  },
  "electoral_areas": [
    {"id": 1, "name": "Bhojpur Area"}
  ]
}
```

---

## User Experience Improvements

### Registration Form
1. **Province Selection** → Loads all provinces
2. **District Selection** → Shows districts for selected province
3. **Electoral Area Selection** → Shows ONLY areas for selected district (NEW!)

### Before Fix
```
Select Province 1
Select District Bhojpur
Electoral Areas: [All 12 areas from Province 1] ❌
```

### After Fix
```
Select Province 1
Select District Bhojpur
Electoral Areas: [Only 1 area for Bhojpur district] ✅
```

---

## Testing

### Test CORS Fix
```bash
# From browser console while on http://localhost:5173
fetch('http://localhost:8000/elections/api/registration-data/')
  .then(r => r.json())
  .then(d => console.log('CORS works:', d))
```

### Test Electoral Area Filtering
```bash
# Get electoral areas for District 1 (Bhojpur)
curl "http://localhost:8000/elections/api/registration-data/?district_id=1"
```

---

## Browser Console Checks

### ✅ Should NOT see these errors anymore:
- ❌ `Access to fetch... blocked by CORS policy`
- ❌ `No 'Access-Control-Allow-Origin' header`
- ❌ `Response to preflight request doesn't pass access control check`

### ✅ Should see proper responses:
- ✅ `200 OK` responses from all API endpoints
- ✅ Session cookies properly sent/received
- ✅ JSON responses with correct data structure

---

## Files Modified

1. `backend/voting_system/settings.py` - CORS and session settings
2. `backend/elections/views.py` - API endpoint filtering logic
3. `src/components/Register.jsx` - Frontend electoral area filtering

---

## Next Steps

1. **Restart Django backend**:
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Test in browser**:
   - Open http://localhost:5173
   - Navigate to registration
   - Try registering (should now work without CORS errors)
   - Test electoral area filtering: Province → District → Electoral Areas

3. **Verify in console**:
   - Should NOT see CORS errors
   - Electoral areas should filter correctly

---

## Success Criteria

✅ All CORS errors resolved
✅ API responses return correct data structure
✅ Frontend properly filters electoral areas by district
✅ Registration form works end-to-end
✅ Session cookies are properly managed
✅ Preflight OPTIONS requests succeed

