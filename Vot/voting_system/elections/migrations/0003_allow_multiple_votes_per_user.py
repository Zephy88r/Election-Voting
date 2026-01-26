# Generated migration for Vote model changes

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0002_notification'),  # Depends on the existing 0002 migration
    ]

    operations = [
        # Remove the OneToOneField constraint
        migrations.AlterField(
            model_name='vote',
            name='voter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='elections.user'),
        ),
        # Add unique constraint for voter + vote_type
        migrations.AlterUniqueTogether(
            name='vote',
            unique_together={('voter', 'vote_type')},
        ),
    ]