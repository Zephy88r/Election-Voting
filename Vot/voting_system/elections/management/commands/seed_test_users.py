from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from elections.models import Province, District, ElectoralArea, Party, Candidate

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed database with test data for voting system'

    def handle(self, *args, **options):
        # Create Nepal's 7 provinces
        provinces_data = [
            'Koshi',
            'Madhesh',
            'Bagmati',
            'Gandaki',
            'Lumbini',
            'Karnali',
            'Sudurpashchim'
        ]
        
        provinces = {}
        for pname in provinces_data:
            p, created = Province.objects.get_or_create(name=pname)
            provinces[pname] = p
            if created:
                self.stdout.write(f'Created province: {pname}')

        # Create districts for each province (simplified)
        districts_map = {
            'Koshi': ['Ilam', 'Jhapa', 'Morang', 'Sunsari'],
            'Madhesh': ['Parsa', 'Bara', 'Rautahat', 'Saptari'],
            'Bagmati': ['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Kavre'],
            'Gandaki': ['Pokhara', 'Tanahun', 'Lamjung', 'Gorkha'],
            'Lumbini': ['Kapilvastu', 'Rupandehi', 'Arghakhanchi', 'Gulmi'],
            'Karnali': ['Surkhet', 'Bardiya', 'Banke', 'Dang'],
            'Sudurpashchim': ['Kailali', 'Kanchanpur', 'Dadeldhura', 'Baitadi']
        }

        districts = {}
        for pname, dnames in districts_map.items():
            for dname in dnames:
                d, created = District.objects.get_or_create(
                    name=dname,
                    province=provinces[pname]
                )
                key = f"{pname}_{dname}"
                districts[key] = d
                if created:
                    self.stdout.write(f'Created district: {dname} in {pname}')

        # Create Electoral Areas
        electoral_areas = {}
        for pname in provinces_data:
            for i in range(1, 3):  # 2 electoral areas per province
                ea_name = f"{pname} Electoral Area {i}"
                ea, created = ElectoralArea.objects.get_or_create(
                    name=ea_name,
                    province=provinces[pname]
                )
                electoral_areas[ea_name] = ea
                if created:
                    self.stdout.write(f'Created electoral area: {ea_name}')

        # Create Parties (standardized list used for all provinces)
        parties_data = [
            {'name': 'CPN UML', 'symbol': 'UML'},
            {'name': 'Nepali Congress', 'symbol': 'NC'},
            {'name': 'Rastra Swatantra Party (RSP)', 'symbol': 'RSP'},
            {'name': 'CPN UML (Moist)', 'symbol': 'UMLM'},
        ]

        parties = {}
        for pdata in parties_data:
            p, created = Party.objects.get_or_create(
                name=pdata['name'],
                defaults={'symbol': pdata['symbol'], 'is_active': True}
            )
            parties[pdata['name']] = p
            if created:
                self.stdout.write(f'Created party: {pdata["name"]}')

        # Create Candidates
        candidates_created = 0
        for ea_name, ea in electoral_areas.items():
            for i, party_name in enumerate(list(parties.keys())[:3]):
                cname = f"Candidate {i+1} from {ea_name}"
                c, created = Candidate.objects.get_or_create(
                    name=cname,
                    electoral_area=ea,
                    defaults={'party': parties[party_name]}
                )
                if created:
                    candidates_created += 1

        self.stdout.write(f'Created {candidates_created} candidates')

        # Create Test Users
        test_users = [
            {
                'username': 'voter1',
                'email': 'voter1@test.com',
                'password': 'testpass123',
                'first_name': 'John',
                'last_name': 'Doe',
                'province': 'Bagmati',
                'district': 'Kathmandu',
                'electoral_area': 'Bagmati Electoral Area 1',
            },
            {
                'username': 'voter2',
                'email': 'voter2@test.com',
                'password': 'testpass123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'province': 'Gandaki',
                'district': 'Pokhara',
                'electoral_area': 'Gandaki Electoral Area 1',
            },
            {
                'username': 'voter3',
                'email': 'voter3@test.com',
                'password': 'testpass123',
                'first_name': 'Ram',
                'last_name': 'Kumar',
                'province': 'Lumbini',
                'district': 'Kapilvastu',
                'electoral_area': 'Lumbini Electoral Area 1',
            },
        ]

        users_created = 0
        for udata in test_users:
            user, created = User.objects.get_or_create(
                username=udata['username'],
                defaults={
                    'email': udata['email'],
                    'first_name': udata['first_name'],
                    'last_name': udata['last_name'],
                    'province': provinces.get(udata['province']),
                    'district': districts.get(f"{udata['province']}_{udata['district']}"),
                    'electoral_area': electoral_areas.get(udata['electoral_area']),
                }
            )
            if created:
                user.set_password(udata['password'])
                user.save()
                users_created += 1
                self.stdout.write(f'Created user: {udata["username"]} (password: {udata["password"]})')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {users_created} test users'))
        self.stdout.write(self.style.SUCCESS('Test data seeded successfully!'))
        self.stdout.write('\n✅ Ready to test voting system')
        self.stdout.write('Test credentials:')
        for udata in test_users:
            self.stdout.write(f'  Username: {udata["username"]}, Password: {udata["password"]}')
