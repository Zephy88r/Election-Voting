# Generated migration to consolidate votes into single record per user

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0005_consolidate_vote_data'),
    ]

    operations = [
        # First, remove the unique_together constraint
        migrations.AlterUniqueTogether(
            name='vote',
            unique_together=set(),
        ),
        
        # Change voter field to OneToOneField
        migrations.AlterField(
            model_name='vote',
            name='voter',
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='vote',
                to='elections.user'
            ),
        ),
        
        # Update vote_type choices
        migrations.AlterField(
            model_name='vote',
            name='vote_type',
            field=models.CharField(
                choices=[
                    ('COMBINED', 'Combined Vote'),
                    ('FPTP', 'Candidate Vote'),
                    ('PR', 'Party Vote'),
                    ('CANDIDATE', 'Candidate Vote'),
                    ('PARTY', 'Party Vote')
                ],
                default='COMBINED',
                max_length=10
            ),
        ),
    ]