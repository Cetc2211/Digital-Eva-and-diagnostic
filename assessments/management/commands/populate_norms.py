from django.core.management.base import BaseCommand
from assessments.models import Norms

class Command(BaseCommand):
    help = 'Populates initial norms data'

    def handle(self, *args, **kwargs):
        # Define ranges matching scoring.py
        age_ranges = [
            (6, 7), (8, 9), (10, 11), (12, 13), (14, 15), (16, 17),
            (18, 30), (31, 55), (56, 85)
        ]

        education_levels = ['0', '1-4', '5-9', '10-24', 'N/A']

        # Dummy data for subtests
        subtests = [
            "Orientación", "Dígitos Progresión", "Dígitos Regresión",
            "Memoria Verbal", "Fluidez", "Comprensión", "Sentido", "Funciones Ejecutivas"
        ]

        # Create norms for each combination
        for start, end in age_ranges:
            for edu in education_levels:
                # Skip irrelevant combinations if needed (e.g. child + high edu)
                if start < 18 and edu != 'N/A': continue
                if start >= 18 and edu == 'N/A': continue

                data = {}
                for subtest in subtests:
                    # Generic values, in reality these would be specific
                    data[subtest] = {"mean": 10, "sd": 3}

                Norms.objects.get_or_create(
                    age_range_start=start,
                    age_range_end=end,
                    education_level=edu,
                    defaults={'data': data}
                )

        self.stdout.write(self.style.SUCCESS('Successfully populated norms'))
