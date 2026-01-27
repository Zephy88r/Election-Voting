"""
This module controls:
- What data a voter can see
- Before voting
- After voting

IMPORTANT:
- Frontend must rely on this output
- Do NOT expose unrestricted querysets
"""

from elections.models import Candidate, Party, FPTPVote, PRVote
from elections.services.vote_permissions import validate_user_profile


class VoteVisibilityError(Exception):
    """Raised when visibility rules are violated"""
    pass


def user_has_voted(user):
    """
    Check if user has already voted (FPTP or PR)
    """
    fptp_voted = FPTPVote.objects.filter(voter=user).exists()
    pr_voted = PRVote.objects.filter(voter=user).exists()
    return fptp_voted or pr_voted


def get_fptp_vote(user):
    """Get user's FPTP vote if exists"""
    return FPTPVote.objects.filter(voter=user).first()


def get_pr_vote(user):
    """Get user's PR vote if exists"""
    return PRVote.objects.filter(voter=user).first()


def get_voting_context_for_user(user):
    """
    Returns voting data the user is allowed to see.

    If user already voted → limited response
    If not voted → show valid voting options only

    Returns dict
    """
    validate_user_profile(user)

    fptp_vote = get_fptp_vote(user)
    pr_vote = get_pr_vote(user)

    if fptp_vote or pr_vote:
        context = {
            "has_voted": True,
            "message": "User has already voted",
        }
        if fptp_vote:
            context["fptp_vote"] = {
                "candidate": fptp_vote.candidate.name if fptp_vote.candidate else None,
                "voted_at": fptp_vote.created_at.isoformat()
            }
        if pr_vote:
            context["pr_vote"] = {
                "party": pr_vote.party.name if pr_vote.party else None,
                "voted_at": pr_vote.created_at.isoformat()
            }
        return context

    # User has NOT voted → show valid options
    candidates = Candidate.objects.filter(
        electoral_area=user.electoral_area
    ).select_related("electoral_area")

    parties = Party.objects.filter(is_active=True)

    return {
        "has_voted": False,
        "province": {
            "id": user.province.id,
            "name": user.province.name,
        },
        "district": {
            "id": user.district.id,
            "name": user.district.name,
        },
        "electoral_area": {
            "id": user.electoral_area.id,
            "name": user.electoral_area.name,
        },
        "candidates": [
            {"id": c.id, "name": c.name}
            for c in candidates
        ],
        "parties": [
            {"id": p.id, "name": p.name}
            for p in parties
        ],
    }