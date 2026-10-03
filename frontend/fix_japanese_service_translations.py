from pathlib import Path

file = Path("assets/js/page_translations.js")

content = file.read_text(encoding="utf-8")

if "service_cybersecurity_title" in content[content.find('    "ja": {'):]:
    print("Japanese service translations already exist.")
    raise SystemExit(0)

ja_start = content.find('    "ja": {')

if ja_start == -1:
    raise SystemExit("ERROR: Japanese block not found.")

# Find the final placeholder inside the Japanese block
placeholder = '        "placeholder_name": "Enter your full name",'

ja_placeholder = content.find(placeholder, ja_start)

if ja_placeholder == -1:
    raise SystemExit("ERROR: Japanese placeholder section not found.")

insert = '''        "service_cybersecurity_title": "サイバーセキュリティ",
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

content = (
    content[:ja_placeholder]
    + insert
    + content[ja_placeholder:]
)

file.write_text(content, encoding="utf-8")

print("SUCCESS: Japanese service translations added.")
