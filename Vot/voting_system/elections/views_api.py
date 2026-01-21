from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from .models import Candidate, Party, District, Vote, Notification



def districts_by_province(request): 
    """
    Returns districts for a given province (AJAX helper)
    GET param: province_id
    """
    province_id = request.GET.get('province_id') 
    districts_list = []

    if province_id:
        districts = District.objects.filter(province_id=province_id).values('id', 'name')
        districts_list = list(districts)

    return JsonResponse(districts_list, safe=False)

@login_required
def voter_profile(request):
    user = request.user
    return JsonResponse({
        "username": user.username,
        "province": {"id": user.province.id, "name": user.province.name},
        "district": {"id": user.district.id, "name": user.district.name},
        "electoral_area": {
            "id": user.electoral_area.id,
            "name": user.electoral_area.name
        }
    })


@login_required
def candidate_list(request):
    candidates = Candidate.objects.filter(
        electoral_area=request.user.electoral_area
    ).values("id", "name")
    return JsonResponse(list(candidates), safe=False)


@login_required
def party_list(request):
    parties = Party.objects.filter(is_active=True).values("id", "name", "symbol")
    return JsonResponse(list(parties), safe=False)


# ==============================
# Voting History & Status
# ==============================

@login_required
def voting_history(request):
    """Get user's voting history"""
    try:
        votes = Vote.objects.filter(voter=request.user).select_related(
            'candidate', 'party', 'province', 'district', 'electoral_area'
        )

        history = []
        for vote in votes:
            vote_data = {
                'id': vote.id,
                'vote_type': vote.vote_type,
                'province': {
                    'id': vote.province.id,
                    'name': vote.province.name
                },
                'district': {
                    'id': vote.district.id,
                    'name': vote.district.name
                },
                'voted_at': vote.created_at.isoformat(),
            }

            if vote.vote_type == 'FPTP' and vote.candidate:
                vote_data['candidate'] = {
                    'id': vote.candidate.id,
                    'name': vote.candidate.name,
                    'party': vote.candidate.party.name if vote.candidate.party else None
                }
            elif vote.vote_type == 'PR' and vote.party:
                vote_data['party'] = {
                    'id': vote.party.id,
                    'name': vote.party.name,
                    'symbol': vote.party.symbol
                }

            history.append(vote_data)

        return JsonResponse({'votes': history})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def voting_status(request):
    """Get user's voting status"""
    try:
        votes = Vote.objects.filter(voter=request.user)
        provinces_voted = votes.values_list('province__name', flat=True).distinct()

        return JsonResponse({
            'total_votes': votes.count(),
            'provinces_voted': list(provinces_voted),
            'votes': [
                {
                    'province': vote.province.name,
                    'vote_type': vote.vote_type,
                    'voted_at': vote.created_at.isoformat()
                } for vote in votes
            ]
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ==============================
# Notifications
# ==============================

@login_required
def get_notifications(request):
    """Get user's notifications"""
    try:
        notifications = Notification.objects.filter(user=request.user)

        data = []
        for notification in notifications:
            data.append({
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'type': notification.notification_type,
                'read': notification.read,
                'createdAt': notification.created_at.isoformat(),
                'readAt': notification.read_at.isoformat() if notification.read_at else None
            })

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
@require_http_methods(["POST"])
def create_notification(request):
    """Create a new notification"""
    try:
        data = json.loads(request.body)
        notification = Notification.objects.create(
            user=request.user,
            title=data['title'],
            message=data['message'],
            notification_type=data.get('type', 'info')
        )

        return JsonResponse({
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'type': notification.notification_type,
            'read': notification.read,
            'createdAt': notification.created_at.isoformat()
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
@require_http_methods(["POST"])
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.read = True
        notification.read_at = timezone.now()
        notification.save()

        return JsonResponse({'success': True})

    except Notification.DoesNotExist:
        return JsonResponse({'error': 'Notification not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
@require_http_methods(["POST"])
def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    try:
        Notification.objects.filter(user=request.user, read=False).update(
            read=True,
            read_at=timezone.now()
        )

        return JsonResponse({'success': True})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
@require_http_methods(["DELETE"])
def delete_notification(request, notification_id):
    """Delete a notification"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.delete()

        return JsonResponse({'success': True})

    except Notification.DoesNotExist:
        return JsonResponse({'error': 'Notification not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
@require_http_methods(["POST"])
def clear_all_notifications(request):
    """Clear all notifications"""
    try:
        Notification.objects.filter(user=request.user).delete()

        return JsonResponse({'success': True})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
