from pathlib import Path
import re

BASE = Path(".")

# ---------------------------------------------------------
# Read translation files
# ---------------------------------------------------------

translations_text = (BASE / "assets/js/translations.js").read_text(
    encoding="utf-8"
)

page_translations_text = (BASE / "assets/js/page_translations.js").read_text(
    encoding="utf-8"
)

# Find keys in JavaScript dictionaries.
# This captures keys such as:
# nav_home: "Home"
# "about_text_001": "ABOUT BITASEC"
key_pattern = re.compile(
    r'^\s*(?:"([^"]+)"|([A-Za-z0-9_]+))\s*:',
    re.MULTILINE
)

def extract_keys(text):
    keys = set()

    for match in key_pattern.finditer(text):
        key = match.group(1) or match.group(2)
        keys.add(key)

    return keys


translation_keys = extract_keys(translations_text)
page_translation_keys = extract_keys(page_translations_text)

all_translation_keys = translation_keys | page_translation_keys

# ---------------------------------------------------------
# Read HTML translation keys
# ---------------------------------------------------------

html_keys = {}

for html_file in BASE.glob("*.html"):

    text = html_file.read_text(encoding="utf-8")

    keys = set(
        re.findall(
            r'data-i18n=["\']([^"\']+)["\']',
            text
        )
    )

    html_keys[html_file.name] = keys


# ---------------------------------------------------------
# Report
# ---------------------------------------------------------

print()
print("=" * 70)
print("BITASEC TRANSLATION VALIDATION")
print("=" * 70)

print()
print(f"Global translation keys : {len(translation_keys)}")
print(f"Page translation keys   : {len(page_translation_keys)}")
print(f"Combined translation keys: {len(all_translation_keys)}")

print()

total_html_keys = set()

for filename, keys in html_keys.items():

    total_html_keys.update(keys)

    missing = sorted(
        key for key in keys
        if key not in all_translation_keys
    )

    print("-" * 70)
    print(filename)
    print(f"HTML translation keys : {len(keys)}")
    print(f"Missing keys          : {len(missing)}")

    if missing:
        for key in missing:
            print(f"  MISSING: {key}")
    else:
        print("  ALL KEYS FOUND")

print()
print("=" * 70)
print("TOTAL UNIQUE HTML KEYS")
print("=" * 70)

print(f"Unique HTML keys: {len(total_html_keys)}")

missing_global = sorted(
    key for key in total_html_keys
    if key not in all_translation_keys
)

print(f"Missing keys: {len(missing_global)}")

if missing_global:
    print()
    print("Missing translation keys:")
    for key in missing_global:
        print(f"  - {key}")
else:
    print()
    print("SUCCESS: Every HTML data-i18n key exists.")
    
print()
print("=" * 70)
