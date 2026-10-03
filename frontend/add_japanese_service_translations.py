from pathlib import Path

file = Path("assets/js/page_translations.js")

content = file.read_text(encoding="utf-8")

translations = '''        "service_cybersecurity_title": "サイバーセキュリティ",
        "service_cybersecurity_short": "デジタル環境を保護します。",
        "service_ai_title": "人工知能",
        "service_ai_short": "データをインテリジェントなソリューションに変えます。",
        "service_iot_title": "IoT・スマートホーム",
        "service_iot_short": "デバイス、住宅、環境をつなぎます。",
        "service_networking_title": "ネットワーキング",
        "service_networking_short": "信頼性の高い接続インフラを構築します。",
        "service_electrical_title": "電気工学",
        "service_electrical_short": "インテリジェントな電気・エネルギーソリューション。",
'''

# Find the Japanese language block.
ja_start = content.find('    "ja": {')

if ja_start == -1:
    raise SystemExit("ERROR: Japanese language block was not found.")

# Find the final closing brace of pageTranslations.
final_marker = '\n};'

final_pos = content.rfind(final_marker)

if final_pos == -1:
    raise SystemExit("ERROR: Final pageTranslations closing marker was not found.")

# Find the end of the last Japanese property.
# We insert before the final "    }" that closes the Japanese object.
ja_end = content.rfind('\n    }', ja_start, final_pos)

if ja_end == -1:
    raise SystemExit("ERROR: Japanese language closing brace was not found.")

# Prevent duplicates.
if "service_cybersecurity_title" in content[ja_start:final_pos]:
    raise SystemExit("ERROR: Japanese service translations already exist.")

new_content = (
    content[:ja_end]
    + "\n\n"
    + translations.rstrip("\n")
    + content[ja_end:]
)

file.write_text(new_content, encoding="utf-8")

print("SUCCESS: Japanese service translations added.")
