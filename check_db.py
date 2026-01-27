import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from elections.models import Province, District, ElectoralArea

provinces = Province.objects.all()[:2]
for p in provinces:
    print(f"Province: {p.id} - {p.name}")
    districts = p.districts.all()[:1]
    for d in districts:
        print(f"  District: {d.id} - {d.name}")
    electoral_areas = p.electoral_areas.all()[:1]
    for ea in electoral_areas:
        print(f"  Electoral Area: {ea.id} - {ea.name}")
