from django.core.management.base import BaseCommand

from elections.models import Candidate, ElectoralArea, Party


class Command(BaseCommand):
    help = "Seed FPTP candidates for Electoral Area 1 by district (idempotent)."

    def handle(self, *args, **options):
        party_by_order = [
            "Nepali Congress",
            "CPN-UML",
            "CPN-Maoist",
        ]

        parties = {}
        missing_parties = []
        for name in party_by_order:
            party = Party.objects.filter(name=name).first()
            if not party:
                missing_parties.append(name)
            parties[name] = party

        if missing_parties:
            raise SystemExit(
                "Missing required parties: "
                + ", ".join(missing_parties)
                + ". Create them first, then re-run."
            )

        candidates_by_district = {
            # Province 1 (Koshi)
            "Bhojpur": ["Dhan Bahadur Rai", "Sushila Shrestha", "Kiran Karki"],
            "Dhankuta": ["Prakash Limbu", "Rojina Rai", "Hari Prasad Acharya"],
            "Ilam": ["Umesh Rai", "Sabina Limbu", "Ramesh Sharma"],
            "Jhapa": ["Sunil Kafle", "Kabita Karki", "Deepak Rajbanshi"],
            "Khotang": ["Tek Bahadur Rai", "Mina Tamang", "Suman Giri"],
            "Morang": ["Manoj Yadav", "Shristi Tharu", "Nabin Dahal"],
            "Okhaldhunga": ["Bishnu Khadka", "Pabitra Rai", "Milan Adhikari"],
            "Panchthar": ["Rajan Limbu", "Sarita Subba", "Dipesh Rai"],
            "Sankhuwasabha": ["Dawa Sherpa", "Pratima Rai", "Gopal Sharma"],
            "Solukhumbu": ["Pasang Sherpa", "Lhakpa Sherpa", "Nima Rai"],
            "Taplejung": ["Pema Sherpa", "Sunita Limbu", "Ramesh Rai"],
            "Terhathum": ["Birendra Limbu", "Anita Rai", "Hari Prasad Bhattarai"],
            "Udayapur": ["Ramesh Magar", "Nisha Chaudhary", "Rajendra Rai"],
            # Province 2 (Madhesh)
            "Bara": ["Rajesh Kumar Yadav", "Seema Devi Sah", "Imran Ansari"],
            "Dhanusa": ["Ajay Kumar Mandal", "Pooja Kumari Yadav", "Md. Shafiq Alam"],
            "Mahottari": ["Shankar Sah", "Rekha Devi Mandal", "Javed Ahmad"],
            "Parsa": ["Raju Gupta", "Reshma Khatun", "Arif Ansari"],
            "Rautahat": ["Birendra Paswan", "Sabiha Begum", "Deepak Sah"],
            "Saptari": ["Sanjay Yadav", "Rinku Kumari Chaudhary", "Nazrul Haque"],
            "Sarlahi": ["Kamlesh Yadav", "Lalita Devi Sah", "Firoz Alam"],
            "Siraha": ["Ramprit Yadav", "Soni Kumari Mandal", "Salman Ansari"],
            # Province 3 (Bagmati)
            "Bhaktapur": ["Gopal Maharjan", "Maya Tamang", "Prakash Shrestha"],
            "Chitwan": ["Ramesh Poudel", "Shanti Chaudhary", "Suresh Tamang"],
            "Dhading": ["Hari Prasad Thapa", "Rojina Tamang", "Rajan Gurung"],
            "Dolakha": ["Binod Khatri", "Sarmila Tamang", "Nima Sherpa"],
            "Kathmandu": ["Suman Shrestha", "Asha Maharjan", "Niraj Adhikari"],
            "Kavrepalanchok": ["Dipesh Shrestha", "Sunita Tamang", "Roshan Karki"],
            "Lalitpur": ["Prakash Maharjan", "Anjila Shrestha", "Suresh Manandhar"],
            "Makwanpur": ["Raju Lama", "Mina Tamang", "Bir Bahadur Praja"],
            "Nuwakot": ["Hari Adhikari", "Sushila Tamang", "Kiran Gurung"],
            "Ramechhap": ["Bishnu Khadka", "Ritu Tamang", "Sanjiv Sunuwar"],
            "Rasuwa": ["Pemba Tamang", "Sonam Tamang", "Dorje Lama"],
            "Sindhuli": ["Khem Bahadur Thapa", "Nirmala Majhi", "Surendra Gurung"],
            "Sindhupalchok": ["Karma Tamang", "Pratima Sherpa", "Ramesh Lama"],
            # Province 4 (Gandaki)
            "Baglung": ["Dhan Bahadur Thapa", "Sita Pun", "Milan Karki"],
            "Gorkha": ["Rajendra Gurung", "Sabina Ghale", "Bikram Adhikari"],
            "Kaski": ["Prakash Gurung", "Sarita Shrestha", "Nabin Thakali"],
            "Lamjung": ["Dinesh Gurung", "Renu Tamang", "Suman Ghale"],
            "Manang": ["Tashi Gurung", "Pema Lama", "Karma Bhote"],
            "Mustang": ["Tenzing Thakali", "Dolma Gurung", "Pasang Bista"],
            "Myagdi": ["Hari Pun", "Manisha Thakali", "Dipak Thapa"],
            "Nawalpur": ["Rajan Chaudhary", "Mina Tharu", "Suresh Adhikari"],
            "Parbat": ["Bishal Sharma", "Anju Gurung", "Roshan Pariyar"],
            "Syangja": ["Khagendra Ghimire", "Rojina Gurung", "Dipesh Pariyar"],
            # Province 5 (Lumbini)
            "Arghakhanchi": ["Ramesh Khadka", "Sushila BK", "Dipak Acharya"],
            "Banke": ["Kamal Tharu", "Shanti Chaudhary", "Raju Khan"],
            "Bardiya": ["Bir Bahadur Tharu", "Gita Tharu", "Sanjay Chaudhary"],
            "Dang": ["Ramesh Bhandari", "Sita Tharu", "Prakash KC"],
            "Gulmi": ["Hari Prasad Sharma", "Sita Kumari Rana", "Ramesh Pariyar"],
            "Kapilvastu": ["Rajesh Kurmi", "Nisha Chaudhary", "Salim Ansari"],
            "Nawalparasi West": ["Birendra Chaudhary", "Mina Tharu", "Imran Alam"],
            "Palpa": ["Tika Ram Poudel", "Sarita Magar", "Dipesh Sunar"],
            "Pyuthan": ["Hem Bahadur Thapa", "Renu Magar", "Milan BK"],
            "Rolpa": ["Lokendra Pun", "Manisha Magar", "Suraj BK"],
            "Rupandehi": ["Ramesh Yadav", "Sita Tharu", "Prakash Gurung"],
            # Province 6 (Karnali)
            "Dailekh": ["Narayan Karki", "Sita Shahi", "Dipak BK"],
            "Dolpa": ["Pasang Lama", "Dolma Gurung", "Sonam Thakuri"],
            "Humla": ["Pemba Lama", "Chhiring Tamang", "Sonam Rokaya"],
            "Jumla": ["Tek Bahadur Shahi", "Manju Rawat", "Dipak Nepal"],
            "Kalikot": ["Dhan Bahadur Shahi", "Sita Sunar", "Nabin Rokaya"],
            "Mugu": ["Bhim Bahadur Shahi", "Renu Budha", "Milan Rawat"],
            "Rukum West": ["Lokendra Pun", "Sarmila Magar", "Dipak BK"],
            "Salyan": ["Hari Bahadur KC", "Sita Bhandari", "Prakash Kami"],
            "Surkhet": ["Dinesh KC", "Rojina Tharu", "Suman Gurung"],
            # Province 7 (Sudurpashchim)
            "Achham": ["Bhim Bahadur Bohara", "Sita Devi BK", "Dipak Chand"],
            "Bajhang": ["Kedar Bahadur Bista", "Manju Bista", "Roshan Kami"],
            "Bajura": ["Dhan Bahadur Thapa", "Sarmila Budha", "Nabin Rokaya"],
            "Baitadi": ["Hem Bahadur Bhatta", "Sarita Chand", "Dipak Dhami"],
            "Dadeldhura": ["Dil Bahadur Mahara", "Renu Bista", "Prakash Bohara"],
            "Darchula": ["Hari Bahadur Dhami", "Manisha Bista", "Dipak Mahara"],
            "Doti": ["Tek Bahadur Chand", "Sita Bogati", "Roshan Bista"],
            "Kailali": ["Kamal Chaudhary", "Mina Tharu", "Dipak Rana"],
            "Kanchanpur": ["Hari Bahadur Bista", "Rojina Chaudhary", "Suresh Joshi"],
        }

        created_total = 0
        skipped_existing = 0
        missing_areas = []

        for district_name, candidate_names in candidates_by_district.items():
            area = (
                ElectoralArea.objects.select_related("district")
                .filter(district__name=district_name, area_number=1)
                .first()
            )
            if not area:
                area = (
                    ElectoralArea.objects.select_related("district")
                    .filter(district__name=district_name, name=f"{district_name} Electoral Area 1")
                    .first()
                )

            if not area:
                missing_areas.append(district_name)
                continue

            if Candidate.objects.filter(electoral_area=area).exists():
                skipped_existing += 1
                continue

            for index, candidate_name in enumerate(candidate_names):
                party_name = party_by_order[index]
                Candidate.objects.get_or_create(
                    name=candidate_name,
                    electoral_area=area,
                    defaults={"party": parties[party_name]},
                )
                created_total += 1

        if missing_areas:
            self.stdout.write(
                self.style.WARNING(
                    "Missing Electoral Area 1 for districts: "
                    + ", ".join(sorted(missing_areas))
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_total} candidates. "
                f"Skipped {skipped_existing} area(s) with existing candidates."
            )
        )
