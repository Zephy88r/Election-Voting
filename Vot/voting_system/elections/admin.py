from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count
from requests import request
from .models import Province, District, User, ElectoralArea, Candidate, Party, Vote, ElectionControl, FPTPResult, PRResult

# -----------------------------
# Province & District Admin
#admin
# -----------------------------
@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'province')
    list_editable = ('province',)
    list_filter = ('province',)
    search_fields = ('name',)


# -----------------------------
# Custom User Admin
# -----------------------------
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'province', 'district', 'electoral_area', 'is_staff', 'is_active')
    list_filter = ('province', 'district', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    fieldsets = UserAdmin.fieldsets + (
        ('Voting Details', {'fields': ('province', 'district', 'electoral_area')}),
    )

    class Media:
        js = ("elections/admin.js",)  # Auto-filter districts JS

    # 🔑 Auto-filter districts based on selected province
    def get_form(self, request, obj=None, **kwargs):
        request._obj_ = obj
        return super().get_form(request, obj, **kwargs)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'district':
            if request._obj_ and request._obj_.province:
                kwargs['queryset'] = District.objects.filter(province=request._obj_.province)
            else:
                kwargs['queryset'] = District.objects.none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


# -----------------------------
# Electoral Area Admin
# -----------------------------
@admin.register(ElectoralArea)
class ElectoralAreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'province')
    list_filter = ('province',)
    search_fields = ('name', 'province__name')


# -----------------------------
# Candidate Admin
# -----------------------------
@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('name', 'electoral_area')
    list_filter = ('electoral_area',)
    search_fields = ('name', 'electoral_area__name')


# -----------------------------
# Party Admin
# -----------------------------
@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ('name', 'symbol', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

#----------------------------------------
#For Checking if voting is active or not
#----------------------------------------
@admin.register(ElectionControl)
class ElectionControlAdmin(admin.ModelAdmin):
    list_display = ("is_voting_open", "opened_at", "closed_at")

    def has_add_permission(self, request):
        return not ElectionControl.objects.exists()
# -----------------------------
# Vote Admin (Dashboard + List)
# -----------------------------
@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    """
    Admin dashboard for monitoring votes with vote type filtering
    """
    list_display = ('id', 'voter_username', 'vote_type', 'candidate_or_party', 'province', 'district', 'electoral_area', 'created_at')
    list_filter = ('vote_type', 'province', 'district', 'electoral_area', 'created_at')
    search_fields = ('voter__username', 'candidate__name', 'party__name')
    readonly_fields = ('voter', 'vote_type', 'candidate', 'party', 'province', 'district', 'electoral_area', 'created_at')
    ordering = ('-created_at',)

    fieldsets = (
        ('Vote Information', {
            'fields': ('vote_type', 'candidate', 'party')
        }),
        ('Location', {
            'fields': ('province', 'district', 'electoral_area')
        }),
        ('Metadata', {
            'fields': ('voter', 'created_at')
        }),
    )

    def voter_username(self, obj):
        return obj.voter.username
    voter_username.short_description = 'Voter'
    voter_username.admin_order_field = 'voter__username'

    def candidate_or_party(self, obj):
        if obj.vote_type in ['CANDIDATE', 'FPTP']:
            return f"Candidate: {obj.candidate.name}" if obj.candidate else "No candidate"
        elif obj.vote_type in ['PARTY', 'PR']:
            return f"Party: {obj.party.name}" if obj.party else "No party"
        return "-"
    candidate_or_party.short_description = 'Vote For'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context)
        
        try:
            qs = response.context_data['cl'].queryset
            
            # Vote type summary
            vote_type_summary = qs.values('vote_type').annotate(
                total=Count('id')
            ).order_by('vote_type')
            
            # Candidate votes (FPTP)
            candidate_votes = qs.filter(vote_type='FPTP').values(
                'candidate__name', 'candidate__electoral_area__name'
            ).annotate(
                total=Count('id')
            ).order_by('-total')[:10]
            
            # Party votes (PR)
            party_votes = qs.filter(vote_type='PR').values(
                'party__name'
            ).annotate(
                total=Count('id')
            ).order_by('-total')[:10]
            
            extra_context = extra_context or {}
            extra_context.update({
                'vote_type_summary': vote_type_summary,
                'candidate_votes': candidate_votes,
                'party_votes': party_votes,
            })
            
            response.context_data.update(extra_context)
            
        except Exception as e:
            pass
            
        return response
    
#Admin Dashboard Monitoring
@admin.register(FPTPResult)
class FPTPResultAdmin(admin.ModelAdmin):
    list_display = ("electoral_area", "winner", "total_votes")
    list_filter = ("electoral_area",)


@admin.register(PRResult)
class PRResultAdmin(admin.ModelAdmin):
    list_display = ("party", "total_votes", "seats_allocated")
    ordering = ("-seats_allocated",)
    