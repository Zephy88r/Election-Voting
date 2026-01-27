from django.db.models import Count
from elections.models import FPTPVote, PRVote, Candidate, Party


# ------------------------------
# FPTP Results (Candidate Wins)
# ------------------------------
def fptp_results():
    """
    Returns winning candidate per electoral area
    """
    results = (
        FPTPVote.objects
        .values(
            "electoral_area__id",
            "electoral_area__name",
            "candidate__id",
            "candidate__name",
        )
        .annotate(total_votes=Count("id"))
        .order_by("electoral_area__id", "-total_votes")
    )

    winners = {}
    for row in results:
        ea_id = row["electoral_area__id"]
        if ea_id not in winners:
            winners[ea_id] = row

    return list(winners.values())


# ------------------------------
# PR Results (Party Totals)
# ------------------------------
def pr_results():
    """
    Returns total party votes (PR system)
    """
    return (
        PRVote.objects
        .values("party__id", "party__name")
        .annotate(total_votes=Count("id"))
        .order_by("-total_votes")
    )