import os
import django
import sys

# Setup Django environment
sys.path.append('/app')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
django.setup()

from assessments.scoring import calculate_normalized_score, classify_score
from assessments.models import Norms

# Populate a test norm
Norms.objects.create(
    age_range_start=18,
    age_range_end=30,
    education_level='10-24',
    data={"Orientación": {"mean": 10, "sd": 3}}
)

# Test Calculation
# Raw score 10 (Mean) -> Normalized should be 10
score_10 = calculate_normalized_score(10, 25, 12, "Orientación")
print(f"Raw 10 -> Norm {score_10} (Expected 10)")

# Raw score 7 (Mean - 1SD = 7) -> Normalized should be 7
score_7 = calculate_normalized_score(7, 25, 12, "Orientación")
print(f"Raw 7 -> Norm {score_7} (Expected 7)")

# Raw score 4 (Mean - 2SD = 4) -> Normalized should be 4
score_4 = calculate_normalized_score(4, 25, 12, "Orientación")
print(f"Raw 4 -> Norm {score_4} (Expected 4)")

# Test Classification
print(f"Norm 10 -> {classify_score(10)} (Expected Normal)")
print(f"Norm 7 -> {classify_score(7)} (Expected Normal)")
print(f"Norm 6 -> {classify_score(6)} (Expected Alteraciones Moderadas)")
print(f"Norm 4 -> {classify_score(4)} (Expected Alteraciones Moderadas)")
print(f"Norm 3 -> {classify_score(3)} (Expected Alteraciones Severas)")
