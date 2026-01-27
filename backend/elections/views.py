from django.http import JsonResponse, HttpResponse
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Count
from django.contrib.admin.views.decorators import staff_member_required
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
import json

from .models import (
    District,
    Candidate,
    Party,
    Vote,
    FPTPVote,
    PRVote,
    ElectoralArea,
    Province,
    ElectionControl
)
from .utils import fptp_winners, pr_seat_allocation
from elections.services.vote_permissions import (
    validate_user_profile,
    validate_candidate_access,
    VotePermissionError,
)
from elections.services.vote_submission import (
    submit_candidate_vote,
    submit_party_vote,
)
from elections.services.vote_visibility import (
    get_voting_context_for_user,
    VoteVisibilityError,
)
from elections.services.results import fptp_results, pr_results

User = get_user_model()


# ------------------------------
# CSRF Token
# ------------------------------
def get_csrf_token(request):
    """Get CSRF token for frontend"""
    return JsonResponse({'csrfToken': get_token(request)})


# ------------------------------
# Home / Test
# ------------------------------
def home(request):
    return HttpResponse("Welcome to Voting System!")


# ------------------------------
# Registration Data Endpoint
# ------------------------------
def get_registration_data(request):
    """
    Get all registration data: provinces with districts and electoral areas
    Used by frontend registration form
    GET params (optional):
      - district_id: Filter electoral areas by district
    """
    # Check if filtering by district
    district_id = request.GET.get('district_id')
    
    if district_id:
        # Return electoral areas for a specific district
        try:
            district = District.objects.get(id=district_id)
            electoral_areas = ElectoralArea.objects.filter(district_id=district_id).order_by('name')
            data = {
                'district': {
                    'id': district.id,
                    'name': district.name,
                },
                'electoral_areas': [
                    {'id': ea.id, 'name': ea.name}
                    for ea in electoral_areas
                ]
            }
            return JsonResponse(data)
        except District.DoesNotExist:
            return JsonResponse({'error': 'District not found'}, status=404)
    
    # Return all provinces with districts and electoral areas
    provinces = Province.objects.prefetch_related(
        'districts__electoral_areas',
        'electoral_areas'
    ).all().order_by('name')
    
    data = []
    for province in provinces:
        # Get all districts for this province
        districts = province.districts.all().order_by('name')
        
        # For each district, get its electoral areas
        districts_data = []
        for district in districts:
            district_data = {
                'id': district.id,
                'name': district.name,
                'electoral_areas': [
                    {'id': ea.id, 'name': ea.name}
                    for ea in district.electoral_areas.all().order_by('name')
                ]
            }
            districts_data.append(district_data)
        
        # Also get all electoral areas for this province (for backward compatibility)
        province_electoral_areas = province.electoral_areas.all().order_by('name')
        
        province_data = {
            'id': province.id,
            'name': province.name,
            'districts': districts_data,
            'electoral_areas': [
                {'id': ea.id, 'name': ea.name}
                for ea in province_electoral_areas
            ]
        }
        data.append(province_data)
    
    return JsonResponse({'provinces': data})


# ------------------------------
# Voter Registration
# ------------------------------
@csrf_exempt
def register_voter(request):
    """
    Register a new voter. Method: POST
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        province_id = data.get("province_id")
        district_id = data.get("district_id")
        electoral_area_id = data.get("electoral_area")

        # Basic validation
        if not all([name, email, password, province_id, district_id, electoral_area_id]):
            return JsonResponse({"error": "All fields are required"}, status=400)

        if User.objects.filter(username=email).exists():
            return JsonResponse({"error": "User already exists"}, status=400)

        # Validate region mapping
        province = Province.objects.get(name=province_id)
        district = District.objects.get(name=district_id, province=province)
        electoral_area = ElectoralArea.objects.get(name=electoral_area_id, province=province)

        # Atomic creation
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name,
                province=province,
                district=district,
                electoral_area=electoral_area
            )

        return JsonResponse({"success": "Voter registered successfully"}, status=201)

    except Province.DoesNotExist:
        return JsonResponse({"error": "Invalid province"}, status=400)
    except District.DoesNotExist:
        return JsonResponse({"error": "Invalid district for selected province"}, status=400)
    except ElectoralArea.DoesNotExist:
        return JsonResponse({"error": "Invalid electoral area"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ------------------------------
# Login
# ------------------------------
@csrf_exempt  # Only if you are handling CSRF manually in React
def voter_login(request):
    """
    Log in a voter. POST: { "email": "...", "password": "..." }
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)

        # Authenticate user
        user = authenticate(request, username=email, password=password)
        if user is not None:
            if not user.is_active:
                return JsonResponse({"error": "Account is inactive."}, status=403)

            login(request, user)  # Creates session cookie
            return JsonResponse({"success": "Logged in successfully."}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials."}, status=401)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
def voter_logout(request):
    """Log out the current voter."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not logged in"}, status=401)
    
    logout(request)
    return JsonResponse({"success": "Logged out successfully."}, status=200)

# ------------------------------
# Utility: Check voting status
# ------------------------------
def is_voting_open():
    control = ElectionControl.objects.first()
    return bool(control and control.is_voting_open)



# ------------------------------
# Voting History
# ------------------------------
def voting_history(request):
    """
    Get voting history for current user
    Returns both FPTP and PR votes if they exist
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET request required"}, status=405)
    
    # Get user email from query parameter as fallback
    user_email = request.GET.get('user_email')
    
    # Try to get authenticated user first
    if request.user.is_authenticated:
        user = request.user
    elif user_email:
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return JsonResponse({"votes": []})
    else:
        return JsonResponse({"votes": []})
    
    votes = []
    
    # Check FPTP vote
    fptp_vote = FPTPVote.objects.filter(voter=user).first()
    if fptp_vote:
        votes.append({
            "id": fptp_vote.id,
            "vote_type": "FPTP",
            "candidate": fptp_vote.candidate.name if fptp_vote.candidate else None,
            "created_at": fptp_vote.created_at.isoformat()
        })
    
    # Check PR vote
    pr_vote = PRVote.objects.filter(voter=user).first()
    if pr_vote:
        votes.append({
            "id": pr_vote.id,
            "vote_type": "PR",
            "party": pr_vote.party.name if pr_vote.party else None,
            "created_at": pr_vote.created_at.isoformat()
        })
    
    return JsonResponse({"votes": votes})


# ------------------------------
# Vote Submission
# ------------------------------
@csrf_exempt
def submit_vote(request):
    """Unified vote endpoint (SAFE)"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required"}, status=405)
    
    vote_type = request.POST.get("vote_type")
    candidate_id = request.POST.get("candidate_id")
    party_id = request.POST.get("party_id")
    user_email = request.POST.get("user_email")
    
    if not vote_type:
        return JsonResponse({"error": "vote_type is required"}, status=400)
    
    # Try to get authenticated user first, then fall back to email
    if request.user.is_authenticated:
        user = request.user
    elif user_email:
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    else:
        return JsonResponse({"error": "Authentication required"}, status=401)

    try:
        if vote_type == "FPTP":
            if not candidate_id:
                return JsonResponse({"error": "candidate_id is required for FPTP vote"}, status=400)
            submit_candidate_vote(user, candidate_id)
        elif vote_type == "PR":
            if not party_id:
                return JsonResponse({"error": "party_id is required for PR vote"}, status=400)
            submit_party_vote(user, party_id)
        else:
            return JsonResponse({"error": "Invalid vote type"}, status=400)

        return JsonResponse({"success": "Vote recorded successfully"}, status=201)

    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=403)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ------------------------------
# Candidate / Party Listings
# ------------------------------
def get_candidates(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    user = request.user
    if not user.electoral_area:
        return JsonResponse({"error": "User has no electoral area assigned."}, status=400)

    candidates = user.electoral_area.candidates.all().values("id", "name")
    return JsonResponse(list(candidates), safe=False)


def get_parties(request):
    parties = Party.objects.filter(is_active=True).values("id", "name", "symbol")
    return JsonResponse(list(parties), safe=False)


# ------------------------------
# Test / Temporary Endpoints
# ------------------------------
@login_required
def test_candidate_validation(request):
    candidate_id = request.GET.get("candidate_id")
    if not candidate_id:
        return JsonResponse({"error": "candidate_id is required"}, status=400)

    try:
        candidate = Candidate.objects.select_related("electoral_area").get(id=candidate_id)
    except Candidate.DoesNotExist:
        return JsonResponse({"error": "Invalid candidate"}, status=400)

    if candidate.electoral_area != request.user.electoral_area:
        return JsonResponse({"status": "error", "message": "You are not allowed to vote for this candidate."}, status=403)

    return JsonResponse({"status": "success", "message": "User is allowed to vote for this candidate."})


@login_required
def test_submit_candidate_vote(request):
    candidate_id = request.GET.get("candidate_id")
    if not candidate_id:
        return JsonResponse({"error": "candidate_id is required"}, status=400)
    try:
        vote = submit_candidate_vote(request.user, candidate_id)
        return JsonResponse({"status": "success", "vote_id": vote.id, "type": vote.vote_type})
    except (ValidationError, VotePermissionError) as e:
        return JsonResponse({"error": str(e)}, status=403)


@login_required
def test_submit_party_vote(request):
    party_id = request.GET.get("party_id")
    if not party_id:
        return JsonResponse({"error": "party_id is required"}, status=400)
    try:
        vote = submit_party_vote(request.user, party_id)
        return JsonResponse({"status": "success", "vote_id": vote.id, "type": vote.vote_type})
    except (ValidationError, VotePermissionError) as e:
        return JsonResponse({"error": str(e)}, status=403)


@login_required
def voting_context(request):
    try:
        context = get_voting_context_for_user(request.user)
        return JsonResponse(context)
    except VoteVisibilityError as e:
        return JsonResponse({"error": str(e)}, status=403)


# ------------------------------
# Results / Monitoring
# ------------------------------
@staff_member_required
def fptp_results_view(request):
    return JsonResponse({"results": fptp_results()})


@staff_member_required
def pr_results_view(request):
    return JsonResponse({"results": list(pr_results())})


def fptp_votes_summary(request):
    votes = Vote.objects.filter(vote_type="FPTP")
    province_id = request.GET.get("province_id")
    district_id = request.GET.get("district_id")
    ea_id = request.GET.get("electoral_area_id")
    if province_id:
        votes = votes.filter(province_id=province_id)
    if district_id:
        votes = votes.filter(district_id=district_id)
    if ea_id:
        votes = votes.filter(electoral_area_id=ea_id)
    summary = votes.values("candidate__id", "candidate__name", "electoral_area__name").annotate(total_votes=Count("id"))
    return JsonResponse(list(summary), safe=False)


def pr_votes_summary(request):
    votes = Vote.objects.filter(vote_type="PR")
    province_id = request.GET.get("province_id")
    district_id = request.GET.get("district_id")
    if province_id:
        votes = votes.filter(province_id=province_id)
    if district_id:
        votes = votes.filter(district_id=district_id)
    summary = votes.values("party__id", "party__name").annotate(total_votes=Count("id"))
    return JsonResponse(list(summary), safe=False)


def votes_breakdown(request):
    fptp_count = Vote.objects.filter(vote_type="FPTP").count()
    pr_count = Vote.objects.filter(vote_type="PR").count()
    return JsonResponse({"FPTP": fptp_count, "PR": pr_count, "Total": fptp_count + pr_count})


def seats_summary(request):
    fptp = fptp_winners()
    pr = pr_seat_allocation(total_seats=110)
    return JsonResponse({"fptp_winners": fptp, "pr_seats": pr})


# ------------------------------
# Voter Profile (for frontend)
# ------------------------------
def voter_profile(request):
    """Get voter profile data"""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    user = request.user
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "province": {"id": user.province.id if user.province else None, "name": user.province.name if user.province else None},
        "district": {"id": user.district.id if user.district else None, "name": user.district.name if user.district else None},
        "electoral_area": {"id": user.electoral_area.id if user.electoral_area else None, "name": user.electoral_area.name if user.electoral_area else None},
    }
    return JsonResponse(data, status=200)