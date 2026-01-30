from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count
from requests import request
from .models import (
    Province,
    District,
    User, 
    ElectoralArea,
    Candidate, 
    Party, 
    Vote,
    FPTPVote,
    PRVote,
    ElectionControl,
    FPTPResult,
    PRResult,
)

# -----------------------------
# Province & District Admin
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
    list_editable = ('province',)
    search_fields = ('name', 'province__name')


# -----------------------------
# Candidate Admin
# -----------------------------
@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "electoral_area", "party")
    list_filter = ("electoral_area", "party")
    search_fields = ("name",)


# -----------------------------
# Party Admin
# -----------------------------
@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "symbol", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)

#----------------------------------------
#For Checking if voting is active or not
#----------------------------------------
@admin.register(ElectionControl)
class ElectionControlAdmin(admin.ModelAdmin):
    list_display = ("is_voting_open", "opened_at", "closed_at")

    def has_add_permission(self, request):
        return not ElectionControl.objects.exists()


# -----------------------------
# FPTP Vote Admin
# -----------------------------
@admin.register(FPTPVote)
class FPTPVoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "voter",
        "candidate",
        "province",
        "district",
        "created_at",
    )

    list_filter = (
        "province",
        "district",
        "created_at",
    )

    search_fields = (
        "voter__username",
        "candidate__name",
    )

    readonly_fields = ("created_at",)


# -----------------------------
# PR Vote Admin
# -----------------------------
@admin.register(PRVote)
class PRVoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "voter",
        "party",
        "province",
        "district",
        "created_at",
    )

    list_filter = (
        "province",
        "district",
        "created_at",
    )

    search_fields = (
        "voter__username",
        "party__name",
    )

    readonly_fields = ("created_at",)


# -----------------------------
# Vote Admin (Legacy)
# -----------------------------
# Unregister previous Vote if registered
try:
    admin.site.unregister(Vote)
except admin.sites.NotRegistered:
    pass

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "voter",
        "vote_type",
        "candidate_or_party",
        "province",
        "district",
        "electoral_area",
        "created_at",
    )

    list_filter = (
        "vote_type",
        "province",
        "district",
    )

    search_fields = (
        "voter__username",
        "candidate__name",
        "party__name",
    )

    # Show Candidate or Party depending on vote type
    def candidate_or_party(self, obj):
        if obj.vote_type == "FPTP":
            return obj.candidate.name if obj.candidate else "-"
        else:
            return obj.party.name if obj.party else "-"
    candidate_or_party.short_description = "Vote For"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related(
            "province",
            "district",
            "electoral_area",
        )
    
    ordering = ("-created_at",)


# -----------------------------
# FPTP Result Admin
# -----------------------------
@admin.register(FPTPResult)
class FPTPResultAdmin(admin.ModelAdmin):
    list_display = ("electoral_area", "winner", "total_votes")
    list_filter = ("electoral_area",)


@admin.register(PRResult)
class PRResultAdmin(admin.ModelAdmin):
    list_display = ("party", "total_votes", "seats_allocated")
    ordering = ("-seats_allocated",)
    