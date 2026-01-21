from django.urls import path
from . import views, views_api

urlpatterns = [
    # -------- API endpoints --------
    path("api/auth/login/", views.api_login, name="api-login"),
    path("api/auth/logout/", views.api_logout, name="api-logout"),
    path("api/voter/register/", views.register_voter, name="register-voter"),
    path("api/voter/profile/", views_api.voter_profile, name="voter-profile"),
    path("api/candidates/", views_api.candidate_list, name="candidate-list"),
    path("api/parties/", views_api.party_list, name="party-list"),
    path("api/vote/", views.api_vote, name="api-vote"),
    path("api/csrf/", views.get_csrf, name="api-csrf"),
    path("api/registration-data/", views_api.get_registration_data, name="registration-data"),

    # New API endpoints
    path("api/voting-history/", views_api.voting_history, name="voting-history"),
    path("api/voting/status/", views_api.voting_status, name="voting-status"),
    path("api/notifications/", views_api.get_notifications, name="get-notifications"),
    path("api/notifications/create/", views_api.create_notification, name="create-notification"),
    path("api/notifications/<int:notification_id>/read/", views_api.mark_notification_read, name="mark-notification-read"),
    path("api/notifications/<int:notification_id>/", views_api.delete_notification, name="delete-notification"),
    path("api/notifications/mark-all-read/", views_api.mark_all_notifications_read, name="mark-all-notifications-read"),
    path("api/notifications/clear-all/", views_api.clear_all_notifications, name="clear-all-notifications"),

    # -------- Voting --------
    path("vote/submit/", views.submit_vote, name="submit-vote"),
    path("vote/candidate/", views.submit_candidate_vote, name="submit-candidate-vote"),
    path("vote/party/", views.submit_party_vote, name="submit-party-vote"),

    # -------- Results / Monitoring --------
    path("results/candidates/", views.fptp_votes_summary, name="candidate-results"),
    path("results/parties/", views.pr_votes_summary, name="party-results"),
    path("results/summary/", views.votes_breakdown, name="voting-summary"),
    path("results/seats/", views.seats_summary, name="seats-summary"),

    # -------- Temporary / Test Endpoints --------
    path("test/validate/candidate/", views.test_candidate_validation, name="test-candidate-validation"),
    path("test/vote/candidate/", views.test_submit_candidate_vote, name="test-submit-candidate"),
    path("test/vote/party/", views.test_submit_party_vote, name="test-submit-party"),
    path("test/voting/context/", views.voting_context, name="test-voting-context"),
]