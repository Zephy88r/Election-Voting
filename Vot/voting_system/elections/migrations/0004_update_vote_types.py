# Generated migration for Vote model updates

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0003_allow_multiple_votes_per_user'),
    ]

    operations = [
        # Update vote type choices to support both old and new values
        migrations.AlterField(
            model_name='vote',
            name='vote_type',
            field=models.CharField(
                choices=[
                    ('FPTP', 'Candidate Vote'),  # Keep old value for compatibility
                    ('PR', 'Party Vote'),        # Keep old value for compatibility
                    ('CANDIDATE', 'Candidate Vote'),
                    ('PARTY', 'Party Vote')
                ],
                max_length=10
            ),
        ),
    ]