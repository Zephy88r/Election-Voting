# Data migration to consolidate existing votes before changing to OneToOneField

from django.db import migrations


def consolidate_votes(apps, schema_editor):
    Vote = apps.get_model('elections', 'Vote')
    User = apps.get_model('elections', 'User')
    
    # Get all users who have votes
    users_with_votes = User.objects.filter(votes__isnull=False).distinct()
    
    for user in users_with_votes:
        user_votes = Vote.objects.filter(voter=user).order_by('created_at')
        
        if user_votes.count() <= 1:
            continue  # User has only one vote, no consolidation needed
        
        # Find candidate and party votes
        candidate_vote = user_votes.filter(vote_type__in=['CANDIDATE', 'FPTP']).first()
        party_vote = user_votes.filter(vote_type__in=['PARTY', 'PR']).first()
        
        # Create or update the first vote to be the consolidated vote
        consolidated_vote = user_votes.first()
        consolidated_vote.vote_type = 'COMBINED'
        
        # Set candidate if found
        if candidate_vote and candidate_vote != consolidated_vote:
            consolidated_vote.candidate = candidate_vote.candidate
        
        # Set party if found
        if party_vote and party_vote != consolidated_vote:
            consolidated_vote.party = party_vote.party
        
        consolidated_vote.save()
        
        # Delete all other votes for this user
        user_votes.exclude(id=consolidated_vote.id).delete()


def reverse_consolidate_votes(apps, schema_editor):
    # This is irreversible, but we can at least not crash
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0004_update_vote_types'),
    ]

    operations = [
        migrations.RunPython(consolidate_votes, reverse_consolidate_votes),
    ]