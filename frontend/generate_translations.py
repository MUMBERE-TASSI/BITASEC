import re
import html
import time
from pathlib import Path

from deep_translator import GoogleTranslator


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_FILE = BASE_DIR / "assets" / "js" / "translations.js"

LANGUAGES = {
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "pt": "Portuguese",
    "sw": "Swahili",
    "de": "German",
    "ar": "Arabic",
    "zh": "Chinese",
    "hi": "Hindi",
    "ja": "Japanese",
}


# ============================================================
# COMMON TRANSLATIONS
# These are written manually so important UI text stays stable.
# ============================================================

COMMON = {
    "en": {
        "nav_home": "Home",
        "nav_about": "About",
        "nav_services": "Services",
        "nav_projects": "Projects",
        "nav_training": "Training",
        "nav_faq": "FAQ",
        "nav_contact": "Request a Service",
        "form_sending": "Sending...",
        "form_success": "Your request has been sent successfully. We will get back to you.",
        "form_error": "Unable to send your request. Please try again.",
        "send_button": "Send Request",
    },

    "fr": {
        "nav_home": "Accueil",
        "nav_about": "À propos",
        "nav_services": "Services",
        "nav_projects": "Projets",
        "nav_training": "Formation",
        "nav_faq": "FAQ",
        "nav_contact": "Demander un service",
        "form_sending": "Envoi en cours...",
        "form_success": "Votre demande a été envoyée avec succès. Nous vous contacterons.",
        "form_error": "Impossible d'envoyer votre demande. Veuillez réessayer.",
        "send_button": "Envoyer la demande",
    },

    "es": {
        "nav_home": "Inicio",
        "nav_about": "Nosotros",
        "nav_services": "Servicios",
        "nav_projects": "Proyectos",
        "nav_training": "Formación",
        "nav_faq": "Preguntas frecuentes",
        "nav_contact": "Solicitar un servicio",
        "form_sending": "Enviando...",
        "form_success": "Su solicitud se ha enviado correctamente. Nos pondremos en contacto con usted.",
        "form_error": "No se pudo enviar su solicitud. Inténtelo de nuevo.",
        "send_button": "Enviar solicitud",
    },

    "pt": {
        "nav_home": "Início",
        "nav_about": "Sobre nós",
        "nav_services": "Serviços",
        "nav_projects": "Projetos",
        "nav_training": "Formação",
        "nav_faq": "Perguntas frequentes",
        "nav_contact": "Solicitar um serviço",
        "form_sending": "Enviando...",
        "form_success": "Sua solicitação foi enviada com sucesso. Entraremos em contato.",
        "form_error": "Não foi possível enviar sua solicitação. Tente novamente.",
        "send_button": "Enviar solicitação",
    },

    "sw": {
        "nav_home": "Nyumbani",
        "nav_about": "Kuhusu",
        "nav_services": "Huduma",
        "nav_projects": "Miradi",
        "nav_training": "Mafunzo",
        "nav_faq": "Maswali Yanayoulizwa Mara kwa Mara",
        "nav_contact": "Omba Huduma",
        "form_sending": "Inatuma...",
        "form_success": "Ombi lako limetumwa kwa mafanikio. Tutawasiliana nawe.",
        "form_error": "Imeshindikana kutuma ombi lako. Tafadhali jaribu tena.",
        "send_button": "Tuma Ombi",
    },

    "de": {
        "nav_home": "Startseite",
        "nav_about": "Über uns",
        "nav_services": "Dienstleistungen",
        "nav_projects": "Projekte",
        "nav_training": "Schulungen",
        "nav_faq": "FAQ",
        "nav_contact": "Service anfragen",
        "form_sending": "Wird gesendet...",
        "form_success": "Ihre Anfrage wurde erfolgreich gesendet. Wir werden uns bei Ihnen melden.",
        "form_error": "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        "send_button": "Anfrage senden",
    },

    "ar": {
        "nav_home": "الرئيسية",
        "nav_about": "من نحن",
        "nav_services": "الخدمات",
        "nav_projects": "المشاريع",
        "nav_training": "التدريب",
        "nav_faq": "الأسئلة الشائعة",
        "nav_contact": "طلب خدمة",
        "form_sending": "جارٍ الإرسال...",
        "form_success": "تم إرسال طلبك بنجاح. سنتواصل معك.",
        "form_error": "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى.",
        "send_button": "إرسال الطلب",
    },

    "zh": {
        "nav_home": "首页",
        "nav_about": "关于我们",
        "nav_services": "服务",
        "nav_projects": "项目",
        "nav_training": "培训",
        "nav_faq": "常见问题",
        "nav_contact": "请求服务",
        "form_sending": "正在发送...",
        "form_success": "您的请求已成功发送。我们会与您联系。",
        "form_error": "无法发送您的请求。请重试。",
        "send_button": "发送请求",
    },

    "hi": {
        "nav_home": "होम",
        "nav_about": "हमारे बारे में",
        "nav_services": "सेवाएँ",
        "nav_projects": "परियोजनाएँ",
        "nav_training": "प्रशिक्षण",
        "nav_faq": "अक्सर पूछे जाने वाले प्रश्न",
        "nav_contact": "सेवा का अनुरोध करें",
        "form_sending": "भेजा जा रहा है...",
        "form_success": "आपका अनुरोध सफलतापूर्वक भेज दिया गया है। हम आपसे संपर्क करेंगे।",
        "form_error": "आपका अनुरोध भेजा नहीं जा सका। कृपया पुनः प्रयास करें।",
        "send_button": "अनुरोध भेजें",
    },

    "ja": {
        "nav_home": "ホーム",
        "nav_about": "会社概要",
        "nav_services": "サービス",
        "nav_projects": "プロジェクト",
        "nav_training": "トレーニング",
        "nav_faq": "よくある質問",
        "nav_contact": "サービスを依頼",
        "form_sending": "送信中...",
        "form_success": "お問い合わせを正常に送信しました。こちらからご連絡いたします。",
        "form_error": "お問い合わせを送信できませんでした。もう一度お試しください。",
        "send_button": "リクエストを送信",
    },
}


# ============================================================
# EXTRACT TRANSLATION KEYS FROM HTML
# ============================================================

def extract_translations():
    translations = {}

    html_files = sorted(BASE_DIR.glob("*.html"))

    if not html_files:
        raise RuntimeError("No HTML files were found in the frontend directory.")

    pattern = re.compile(
        r'data-i18n="([^"]+)"[^>]*>(.*?)</',
        re.DOTALL | re.IGNORECASE
    )

    for html_file in html_files:
        content = html_file.read_text(encoding="utf-8")

        for match in pattern.finditer(content):
            key = match.group(1).strip()
            value = match.group(2).strip()

            # Remove HTML tags.
            value = re.sub(r"<[^>]+>", "", value)

            # Decode HTML entities such as &amp;
            value = html.unescape(value)

            # Normalize whitespace.
            value = re.sub(r"\s+", " ", value).strip()

            if key and value:
                translations[key] = value

    # Extract placeholder translations.
    placeholder_pattern = re.compile(
        r'data-i18n-placeholder="([^"]+)"[^>]*placeholder="([^"]*)"',
        re.IGNORECASE
    )

    for html_file in html_files:
        content = html_file.read_text(encoding="utf-8")

        for match in placeholder_pattern.finditer(content):
            key = match.group(1).strip()
            value = html.unescape(match.group(2).strip())

            if key and value:
                translations[key] = value

    return translations


# ============================================================
# TRANSLATE ONE TEXT
# ============================================================

def translate_text(text, target_language):
    if target_language == "en":
        return text

    try:
        translator = GoogleTranslator(
            source="en",
            target=target_language
        )

        result = translator.translate(text)

        if result:
            return result.strip()

    except Exception as error:
        print(
            f"    Translation failed for '{text[:60]}...': {error}"
        )

    return text


# ============================================================
# GENERATE JAVASCRIPT
# ============================================================

def js_escape(value):
    """
    Escape a Python string so it is safe inside a JavaScript
    double-quoted string.
    """
    value = value.replace("\\", "\\\\")
    value = value.replace('"', '\\"')
    value = value.replace("\r", "\\r")
    value = value.replace("\n", "\\n")
    return value


def generate_js(source_translations):
    lines = []

    lines.append("const translations = {")

    for language_code, language_name in LANGUAGES.items():

        lines.append(f"    {language_code}: {{")

        # Language metadata.
        flags = {
            "en": "🇬🇧",
            "fr": "🇫🇷",
            "es": "🇪🇸",
            "pt": "🇵🇹",
            "sw": "🇰🇪",
            "de": "🇩🇪",
            "ar": "🇸🇦",
            "zh": "🇨🇳",
            "hi": "🇮🇳",
            "ja": "🇯🇵",
        }

        lines.append(
            f'        name: "{js_escape(language_name)}",'
        )

        lines.append(
            f'        flag: "{flags[language_code]}",'
        )

        for key in source_translations:
            if key in COMMON.get(language_code, {}):
                translated = COMMON[language_code][key]
            else:
                translated = translate_text(
                    source_translations[key],
                    language_code
                )

            lines.append(
                f'        "{js_escape(key)}": "{js_escape(translated)}",'
            )

            # Small delay to avoid hammering translation service.
            if language_code != "en":
                time.sleep(0.15)

        lines.append("    },")

    lines.append("};")
    lines.append("")

    return "\n".join(lines)


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 70)
    print("BITASEC TECHNOLOGIES - Translation Generator")
    print("=" * 70)
    print()

    print("Frontend directory:")
    print(BASE_DIR)
    print()

    print("Extracting translation keys from HTML...")
    source_translations = extract_translations()

    print(
        f"Found {len(source_translations)} translation keys."
    )
    print()

    print("Languages:")
    for code, name in LANGUAGES.items():
        print(f"  {code} -> {name}")

    print()
    print("Generating translations...")
    print()

    javascript = generate_js(source_translations)

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    OUTPUT_FILE.write_text(
        javascript,
        encoding="utf-8"
    )

    print()
    print("=" * 70)
    print("SUCCESS")
    print("=" * 70)
    print()
    print(f"Generated:")
    print(OUTPUT_FILE)
    print()
    print(
        f"Translation keys: {len(source_translations)}"
    )
    print(
        f"Languages: {len(LANGUAGES)}"
    )
    print()
    print("Done.")


if __name__ == "__main__":
    main()
