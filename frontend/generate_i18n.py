#!/usr/bin/env python3

import json
import time
from pathlib import Path

from bs4 import BeautifulSoup
from deep_translator import MyMemoryTranslator


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_FILE = BASE_DIR / "assets/js/page_translations.js"

HTML_FILES = sorted(BASE_DIR.glob("*.html"))

LANGUAGES = {
    "fr": ("French", "fr-FR"),
    "es": ("Spanish", "es-ES"),
    "pt": ("Portuguese", "pt-PT"),
    "sw": ("Swahili", "sw-KE"),
    "de": ("German", "de-DE"),
    "ar": ("Arabic", "ar-SA"),
    "zh": ("Chinese", "zh-CN"),
    "hi": ("Hindi", "hi-IN"),
    "ja": ("Japanese", "ja-JP"),
}


def extract_page_translations():
    """
    Read the translation keys already inserted into the HTML.
    """

    entries = {}

    print("=" * 70)
    print("BITASEC MULTILINGUAL GENERATOR")
    print("=" * 70)

    print(f"HTML files found: {len(HTML_FILES)}")

    for html_file in HTML_FILES:
        print(f"\nScanning {html_file.name}...")

        soup = BeautifulSoup(
            html_file.read_text(encoding="utf-8"),
            "html.parser"
        )

        for element in soup.find_all(attrs={"data-i18n": True}):

            key = element.get("data-i18n")

            # Navigation is already handled by translations.js.
            if key.startswith("nav_"):
                continue

            text = element.get_text(" ", strip=True)

            if not text:
                continue

            entries[key] = text

    print("\n" + "=" * 70)
    print(f"TOTAL PAGE STRINGS: {len(entries)}")
    print("=" * 70)

    return entries


def extract_placeholders():
    """
    Find form placeholders that still need translation.
    """

    placeholders = {}

    for html_file in HTML_FILES:

        soup = BeautifulSoup(
            html_file.read_text(encoding="utf-8"),
            "html.parser"
        )

        for element in soup.find_all(
            ["input", "textarea"]
        ):

            placeholder = element.get("placeholder")

            if not placeholder:
                continue

            # Use the HTML field name to create a stable key.
            field_name = element.get("name") or element.get("id")

            if not field_name:
                continue

            key = f"placeholder_{field_name}"

            placeholders[key] = placeholder

    return placeholders


def translate_text(text, target_language):
    """
    Translate one string using MyMemory.
    """

    try:

        translator = MyMemoryTranslator(
            source="en-GB",
            target=target_language
        )

        result = translator.translate(text)

        if result and result.strip():
            return result.strip()

    except Exception as error:

        print(
            f"    WARNING: Translation failed: {error}"
        )

    # Keep English as fallback if translation fails.
    return text


def translate_dictionary(dictionary, language_name, language_code):
    """
    Translate a dictionary while preserving its keys.
    """

    print("\n" + "=" * 70)
    print(
        f"TRANSLATING: {language_name} ({language_code})"
    )
    print("=" * 70)

    translated = {}

    total = len(dictionary)

    for index, (key, text) in enumerate(
        dictionary.items(),
        start=1
    ):

        print(
            f"[{index}/{total}] "
            f"{key}: {text[:70]}"
        )

        translated[key] = translate_text(
            text,
            language_code
        )

        # Respect the public translation service.
        time.sleep(0.35)

    return translated


def write_javascript(page_entries, placeholder_entries, translations):
    """
    Create page_translations.js.
    """

    output = []

    output.append(
        "/*\n"
        " * BITASEC Technologies\n"
        " * Complete multilingual page translations\n"
        " * Generated using MyMemory\n"
        " */\n"
    )

    output.append(
        "const pageTranslations = {"
    )

    # -------------------------------------------------
    # English
    # -------------------------------------------------

    english = {}

    english.update(page_entries)
    english.update(placeholder_entries)

    output.append('    "en": {')

    english_items = list(english.items())

    for index, (key, value) in enumerate(
        english_items
    ):

        comma = (
            ","
            if index < len(english_items) - 1
            else ""
        )

        output.append(
            "        "
            + json.dumps(key, ensure_ascii=False)
            + ": "
            + json.dumps(value, ensure_ascii=False)
            + comma
        )

    output.append("    },")

    # -------------------------------------------------
    # Other languages
    # -------------------------------------------------

    language_items = list(translations.items())

    for language_index, (
        language_code,
        language_dictionary
    ) in enumerate(language_items):

        output.append(
            f'    "{language_code}": {{'
        )

        all_keys = list(english.keys())

        for index, key in enumerate(all_keys):

            comma = (
                ","
                if index < len(all_keys) - 1
                else ""
            )

            value = language_dictionary.get(
                key,
                english[key]
            )

            output.append(
                "        "
                + json.dumps(
                    key,
                    ensure_ascii=False
                )
                + ": "
                + json.dumps(
                    value,
                    ensure_ascii=False
                )
                + comma
            )

        closing_comma = (
            ","
            if language_index < len(language_items) - 1
            else ""
        )

        output.append(
            "    }" + closing_comma
        )

    output.append("};")
    output.append("")

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    OUTPUT_FILE.write_text(
        "\n".join(output),
        encoding="utf-8"
    )


def main():

    page_entries = extract_page_translations()

    placeholder_entries = extract_placeholders()

    print(
        f"\nPAGE STRINGS: {len(page_entries)}"
    )

    print(
        f"PLACEHOLDERS: {len(placeholder_entries)}"
    )

    if not page_entries:
        print(
            "\nERROR: No data-i18n page strings found."
        )
        return

    # English + all placeholders
    all_source_entries = {}

    all_source_entries.update(
        page_entries
    )

    all_source_entries.update(
        placeholder_entries
    )

    translations = {}

    for language_code, (
        language_name,
        target_code
    ) in LANGUAGES.items():

        translations[language_code] = (
            translate_dictionary(
                all_source_entries,
                language_name,
                target_code
            )
        )

    print("\n" + "=" * 70)
    print("CREATING page_translations.js")
    print("=" * 70)

    write_javascript(
        page_entries,
        placeholder_entries,
        translations
    )

    print("\n" + "=" * 70)
    print("SUCCESS")
    print("=" * 70)

    print(
        f"Created: {OUTPUT_FILE}"
    )

    print(
        f"Languages: {len(LANGUAGES) + 1}"
    )

    print(
        f"Page strings: {len(page_entries)}"
    )

    print(
        f"Placeholders: {len(placeholder_entries)}"
    )

    print("=" * 70)


if __name__ == "__main__":
    main()
