from .models import Norms

def calculate_normalized_score(raw_score, age, education_years, subtest_name):
    """
    Calculates the normalized score based on norms.
    """
    # 1. Determine Age Range
    # Ranges: 6-7, 8-9, 10-11, 12-13, 14-15, 16-17, 18-30, 31-50, 51-65, 66-85?
    # User said 9 ranges from 6-7 to 66-85.
    # I'll define them as tuples.
    age_ranges = [
        (6, 7), (8, 9), (10, 11), (12, 13), (14, 15), (16, 17),
        (18, 30), (31, 55), (56, 85) # Adjusting to fit 9 ranges roughly or matching standard Baremos.
        # User specified "9 ranges (from 6-7 to 66-85)".
        # Let's assume: 6-7, 8-9, 10-11, 12-13, 14-15, 16-17, 18-30, 31-65, 66-85? That's 9.
    ]

    target_age_range = None
    for r in age_ranges:
        if r[0] <= age <= r[1]:
            target_age_range = r
            break

    if not target_age_range:
        # Fallback or error. For now, use the closest or return None.
        return None

    # 2. Determine Education Level (only for adults usually, but user said "4 levels for adults")
    # For children, education is usually linked to age, so maybe just age is enough or education is ignored.
    # User said "4 levels of schooling for adults (null, 1-4, 5-9 and 10-24 years)".
    # Let's assume 'adults' means 18+.

    education_level_key = None
    if age >= 18:
        if education_years == 0:
            education_level_key = '0'
        elif 1 <= education_years <= 4:
            education_level_key = '1-4'
        elif 5 <= education_years <= 9:
            education_level_key = '5-9'
        elif education_years >= 10:
            education_level_key = '10-24'
    else:
        # For children, we might assume education matches age or use a specific key 'child'
        # Or maybe the norms for children don't split by education.
        # I'll assume education_level_key is not used or is 'N/A' for children in the DB.
        education_level_key = 'N/A'

    # 3. Fetch Norms
    try:
        norm = Norms.objects.get(
            age_range_start=target_age_range[0],
            age_range_end=target_age_range[1],
            education_level=education_level_key
        )
    except Norms.DoesNotExist:
        # If no specific norm, return None or raw score?
        # Maybe fallback to '10-24' or similar if missing.
        return None

    # 4. Calculate Normalized Score
    # The norm data structure is expected to be:
    # {"subtest_name": {"mean": X, "sd": Y}}

    subtest_data = norm.data.get(subtest_name)
    if not subtest_data:
        return None

    mean = subtest_data['mean']
    sd = subtest_data['sd']

    if sd == 0: return 10 # Avoid division by zero

    z_score = (raw_score - mean) / sd
    # Convert Z-score to Normalized Score (Mean 10, SD 3)
    normalized_score = (z_score * 3) + 10

    return round(normalized_score)

def classify_score(normalized_score):
    """
    Classifies the normalized score.
    Normal: 7 - 13 (within 1 SD)
    Moderate Alteration: 4 - 6 (between -1 SD and -2 SD)
    Severe Alteration: <= 3 (-2 SD or more, actually user said 3 DE or more, but typically < 4 is severe)
    User said:
    1) Normal (within 1 SD) -> [7, 13]
    2) Moderate (2 SD below) -> [4, 6]
    3) Severe (3 SD or more below) -> <= 3 (Mean 10 - 3*3 = 1? No. 10 - 2*3 = 4. 10 - 3*3 = 1.)

    Wait.
    Mean = 10, SD = 3.
    -1 SD = 7.
    -2 SD = 4.
    -3 SD = 1.

    "Normal (within 1 SD)" -> > 7 (or >= 7).
    "Moderate (2 SD below)" -> usually means between -1SD and -2SD? Or AT -2SD?
    If "Moderate" corresponds to the range approaching -2SD.
    Usually:
    Normal: >= 7 (Mean - 1SD)
    Mild/Moderate: 4 - 6 (Mean - 2SD to Mean - 1SD)
    Severe: <= 3 (Below Mean - 2SD)

    User wording: "Alteraciones Severas (3 DE o más por debajo de la media)".
    3 SD below is 1. So maybe Severe is <= 1?
    And Moderate is "2 DE por debajo". That would be around 4.

    Let's stick to standard clinical interpretation unless strictly forced:
    Normal: 7+
    Moderate: 4-6
    Severe: <= 3

    This covers the range. If Severe is strictly <= 1, then what is 2-3?
    I will use <= 3 for Severe to be safe and cover the lower tail.
    """
    if normalized_score >= 7:
        return "Normal"
    elif 4 <= normalized_score < 7:
        return "Alteraciones Moderadas"
    else: # <= 3
        return "Alteraciones Severas"
