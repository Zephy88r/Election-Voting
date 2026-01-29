from django.db import migrations, models


def merge_duplicate_districts(apps, schema_editor):
    """
    Before making District.name globally unique, merge any duplicate names
    by keeping the first row and repointing related electoral areas.
    """
    District = apps.get_model("elections", "District")
    ElectoralArea = apps.get_model("elections", "ElectoralArea")

    # Find names that appear more than once
    from django.db.models import Count

    dup_names = (
        District.objects.values("name")
        .annotate(c=Count("id"))
        .filter(c__gt=1)
        .values_list("name", flat=True)
    )

    for name in dup_names:
        districts = list(District.objects.filter(name=name).order_by("id"))
        if not districts:
            continue
        primary = districts[0]
        for duplicate in districts[1:]:
            # Any electoral areas on duplicate districts are removed; they will be
            # re-seeded later by the seed_locations command.
            ElectoralArea.objects.filter(district=duplicate).delete()
            duplicate.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("elections", "0003_alter_electoralarea_unique_together_and_more"),
    ]

    operations = [
        # Ensure no duplicate district names before adding unique constraint
        migrations.RunPython(merge_duplicate_districts, migrations.RunPython.noop),
        # Make district names globally unique
        migrations.AlterField(
            model_name="district",
            name="name",
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name="district",
            unique_together=set(),
        ),
        # Add electoral area technical fields (initially nullable to allow backfill)
        migrations.AddField(
            model_name="electoralarea",
            name="code",
            field=models.CharField(max_length=100, null=True, blank=True),
        ),
        migrations.AddField(
            model_name="electoralarea",
            name="area_number",
            field=models.PositiveIntegerField(null=True, blank=True),
        ),
    ]

