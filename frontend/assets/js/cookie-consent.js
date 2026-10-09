/*
 * BITASEC Cookie Consent Manager
 * Version: 1.0
 *
 * Essential storage is always enabled.
 * Analytics and marketing remain disabled until consent is given.
 */

(() => {
    "use strict";

    const STORAGE_KEY = "bitasec_cookie_consent";
    const CONSENT_VERSION = 1;

    const existingConsent = (() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

            if (
                saved &&
                saved.version === CONSENT_VERSION &&
                typeof saved.analytics === "boolean" &&
                typeof saved.marketing === "boolean"
            ) {
                return saved;
            }
        } catch (error) {
            console.warn("BITASEC: Could not read cookie preferences.");
        }

        return null;
    })();

    let consent = existingConsent;

    const banner = document.createElement("section");
    banner.id = "bitasec-cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("aria-live", "polite");

    banner.innerHTML = `
        <h2>Your Privacy Matters to BITASEC</h2>

        <p>
            We use essential storage to help our website operate.
            With your permission, we may also use optional analytics
            and marketing technologies. You can accept all, reject
            optional technologies, or customize your preferences.
        </p>

        <div class="bitasec-cookie-links">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="cookie-policy.html">Cookie Policy</a>
        </div>

        <div class="bitasec-cookie-actions">
            <button type="button" class="bitasec-cookie-primary"
                    data-cookie-action="accept">
                Accept All
            </button>

            <button type="button" data-cookie-action="reject">
                Reject Optional
            </button>

            <button type="button" data-cookie-action="settings">
                Cookie Settings
            </button>
        </div>
    `;

    const settings = document.createElement("div");
    settings.id = "bitasec-cookie-settings";
    settings.hidden = true;
    settings.setAttribute("role", "dialog");
    settings.setAttribute("aria-modal", "true");
    settings.setAttribute("aria-labelledby", "bitasec-settings-title");

    settings.innerHTML = `
        <div class="bitasec-cookie-settings-card">
            <h2 id="bitasec-settings-title">Cookie Settings</h2>

            <p>
                Choose which optional technologies you permit.
                Essential storage is required for basic website
                functionality and cannot be disabled here.
            </p>

            <div class="bitasec-cookie-category">
                <div>
                    <strong>Essential</strong>
                    <p>Necessary website functionality and saved preferences.</p>
                </div>
                <input type="checkbox" checked disabled
                       aria-label="Essential storage always enabled">
            </div>

            <div class="bitasec-cookie-category">
                <div>
                    <strong>Analytics</strong>
                    <p>Helps us understand website usage and improve our services.</p>
                </div>
                <input type="checkbox" id="bitasec-analytics">
            </div>

            <div class="bitasec-cookie-category">
                <div>
                    <strong>Marketing</strong>
                    <p>Allows optional marketing and advertising technologies.</p>
                </div>
                <input type="checkbox" id="bitasec-marketing">
            </div>

            <div class="bitasec-cookie-actions" style="margin-top:20px">
                <button type="button" class="bitasec-cookie-primary"
                        data-cookie-action="save">
                    Save Preferences
                </button>

                <button type="button" data-cookie-action="reject">
                    Reject Optional
                </button>

                <button type="button" data-cookie-action="close">
                    Cancel
                </button>
            </div>
        </div>
    `;

    const manageButton = document.createElement("button");
    manageButton.id = "bitasec-cookie-manage";
    manageButton.type = "button";
    manageButton.textContent = "Cookie Preferences";
    manageButton.setAttribute("aria-label", "Change cookie preferences");

    document.body.append(banner, settings, manageButton);

    function saveConsent(analytics, marketing, decision) {
        consent = {
            version: CONSENT_VERSION,
            necessary: true,
            analytics: Boolean(analytics),
            marketing: Boolean(marketing),
            decision,
            updatedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        } catch (error) {
            console.warn(
                "BITASEC: Preferences could not be saved in this browser."
            );
        }

        banner.hidden = true;
        settings.hidden = true;
        manageButton.hidden = false;

        /*
         * Integrations can listen for this event and respond to
         * consent changes. This event does not itself block scripts
         * that were already loaded.
         */
        window.dispatchEvent(
            new CustomEvent("bitasec:consent-changed", {
                detail: { ...consent }
            })
        );
    }

    function openSettings() {
        const analytics = document.getElementById("bitasec-analytics");
        const marketing = document.getElementById("bitasec-marketing");

        analytics.checked = consent ? consent.analytics : false;
        marketing.checked = consent ? consent.marketing : false;

        settings.hidden = false;

        const firstInput = settings.querySelector("#bitasec-analytics");
        firstInput.focus();
    }

    function openBanner() {
        banner.hidden = false;
        settings.hidden = true;

        const acceptButton = banner.querySelector(
            '[data-cookie-action="accept"]'
        );
        acceptButton.focus();
    }

    function rejectOptional() {
        saveConsent(false, false, "rejected");
    }

    function handleAction(event) {
        const button = event.target.closest("[data-cookie-action]");

        if (!button) return;

        switch (button.dataset.cookieAction) {
            case "accept":
                saveConsent(true, true, "accepted");
                break;

            case "reject":
                rejectOptional();
                break;

            case "settings":
                openSettings();
                break;

            case "save":
                saveConsent(
                    document.getElementById("bitasec-analytics").checked,
                    document.getElementById("bitasec-marketing").checked,
                    "custom"
                );
                break;

            case "close":
                settings.hidden = true;
                break;
        }
    }

    banner.addEventListener("click", handleAction);
    settings.addEventListener("click", handleAction);

    settings.addEventListener("click", event => {
        if (event.target === settings) {
            settings.hidden = true;
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !settings.hidden) {
            settings.hidden = true;
        }
    });

    manageButton.addEventListener("click", openSettings);

    if (consent) {
        banner.hidden = true;
        manageButton.hidden = false;
    } else {
        banner.hidden = false;
        manageButton.hidden = true;
    }

// ============================================================
// BITASEC COOKIE CONSENT TRANSLATIONS
// Supports the language selector's bitasec_language setting.
// ============================================================

const cookieTranslations = {
    en: {
        title: "Your Privacy Matters to BITASEC",
        description: "We use essential storage to help our website operate. With your permission, we may also use optional analytics and marketing technologies. You can accept all, reject optional technologies, or customize your preferences.",
        privacy: "Privacy Policy",
        policy: "Cookie Policy",
        accept: "Accept All",
        reject: "Reject Optional",
        settings: "Cookie Settings",
        manage: "Cookie Preferences",
        settingsTitle: "Cookie Settings",
        settingsDescription: "Choose which optional technologies you permit. Essential storage is required for basic website functionality and cannot be disabled here.",
        essential: "Essential",
        essentialDescription: "Necessary website functionality and saved preferences.",
        analytics: "Analytics",
        analyticsDescription: "Helps us understand website usage and improve our services.",
        marketing: "Marketing",
        marketingDescription: "Allows optional marketing and advertising technologies.",
        save: "Save Preferences",
        cancel: "Cancel"
    },

    fr: {
        title: "Votre vie privée compte pour BITASEC",
        description: "Nous utilisons le stockage essentiel au fonctionnement du site. Avec votre autorisation, nous pouvons également utiliser des technologies facultatives d’analyse et de marketing. Vous pouvez tout accepter, refuser les options ou personnaliser vos préférences.",
        privacy: "Politique de confidentialité",
        policy: "Politique relative aux cookies",
        accept: "Tout accepter",
        reject: "Refuser les options",
        settings: "Paramètres des cookies",
        manage: "Préférences des cookies",
        settingsTitle: "Paramètres des cookies",
        settingsDescription: "Choisissez les technologies facultatives que vous autorisez. Le stockage essentiel au fonctionnement du site ne peut pas être désactivé ici.",
        essential: "Essentiels",
        essentialDescription: "Fonctionnement nécessaire du site et préférences enregistrées.",
        analytics: "Analyse",
        analyticsDescription: "Nous aide à comprendre l’utilisation du site et à améliorer nos services.",
        marketing: "Marketing",
        marketingDescription: "Autorise les technologies facultatives de marketing et de publicité.",
        save: "Enregistrer les préférences",
        cancel: "Annuler"
    },

    es: {
        title: "Tu privacidad importa a BITASEC",
        description: "Utilizamos almacenamiento esencial para que el sitio funcione. Con tu permiso, también podemos utilizar tecnologías opcionales de análisis y marketing. Puedes aceptar todo, rechazar las opciones o personalizar tus preferencias.",
        privacy: "Política de privacidad",
        policy: "Política de cookies",
        accept: "Aceptar todo",
        reject: "Rechazar opcionales",
        settings: "Configuración de cookies",
        manage: "Preferencias de cookies",
        settingsTitle: "Configuración de cookies",
        settingsDescription: "Elige qué tecnologías opcionales permites. El almacenamiento esencial para el funcionamiento básico no se puede desactivar aquí.",
        essential: "Esenciales",
        essentialDescription: "Funciones necesarias del sitio y preferencias guardadas.",
        analytics: "Analítica",
        analyticsDescription: "Nos ayuda a comprender el uso del sitio y mejorar nuestros servicios.",
        marketing: "Marketing",
        marketingDescription: "Permite tecnologías opcionales de marketing y publicidad.",
        save: "Guardar preferencias",
        cancel: "Cancelar"
    },

    pt: {
        title: "A sua privacidade é importante para a BITASEC",
        description: "Utilizamos armazenamento essencial para o funcionamento do site. Com a sua autorização, também podemos utilizar tecnologias opcionais de análise e marketing. Pode aceitar tudo, rejeitar as opções ou personalizar as suas preferências.",
        privacy: "Política de Privacidade",
        policy: "Política de Cookies",
        accept: "Aceitar tudo",
        reject: "Rejeitar opcionais",
        settings: "Definições de cookies",
        manage: "Preferências de cookies",
        settingsTitle: "Definições de cookies",
        settingsDescription: "Escolha as tecnologias opcionais que permite. O armazenamento essencial ao funcionamento do site não pode ser desativado aqui.",
        essential: "Essenciais",
        essentialDescription: "Funcionamento necessário do site e preferências guardadas.",
        analytics: "Análise",
        analyticsDescription: "Ajuda-nos a compreender a utilização do site e a melhorar os nossos serviços.",
        marketing: "Marketing",
        marketingDescription: "Permite tecnologias opcionais de marketing e publicidade.",
        save: "Guardar preferências",
        cancel: "Cancelar"
    },

    sw: {
        title: "Faragha yako ni muhimu kwa BITASEC",
        description: "Tunatumia hifadhi muhimu ili tovuti ifanye kazi. Kwa ruhusa yako, tunaweza pia kutumia teknolojia za hiari za uchanganuzi na masoko. Unaweza kukubali zote, kukataa za hiari au kubadilisha mapendeleo yako.",
        privacy: "Sera ya Faragha",
        policy: "Sera ya Vidakuzi",
        accept: "Kubali Zote",
        reject: "Kataa za Hiari",
        settings: "Mipangilio ya Vidakuzi",
        manage: "Mapendeleo ya Vidakuzi",
        settingsTitle: "Mipangilio ya Vidakuzi",
        settingsDescription: "Chagua teknolojia za hiari unazoruhusu. Hifadhi muhimu kwa utendaji wa tovuti haiwezi kuzimwa hapa.",
        essential: "Muhimu",
        essentialDescription: "Utendaji muhimu wa tovuti na mapendeleo yaliyohifadhiwa.",
        analytics: "Uchanganuzi",
        analyticsDescription: "Hutusaidia kuelewa matumizi ya tovuti na kuboresha huduma zetu.",
        marketing: "Masoko",
        marketingDescription: "Hurusu teknolojia za hiari za masoko na matangazo.",
        save: "Hifadhi Mapendeleo",
        cancel: "Ghairi"
    },

    de: {
        title: "Ihre Privatsphäre ist BITASEC wichtig",
        description: "Wir verwenden notwendige Speichertechnologien für den Betrieb unserer Website. Mit Ihrer Zustimmung können wir optionale Analyse- und Marketingtechnologien einsetzen. Sie können alles akzeptieren, optionale Technologien ablehnen oder Ihre Einstellungen anpassen.",
        privacy: "Datenschutzerklärung",
        policy: "Cookie-Richtlinie",
        accept: "Alle akzeptieren",
        reject: "Optionale ablehnen",
        settings: "Cookie-Einstellungen",
        manage: "Cookie-Präferenzen",
        settingsTitle: "Cookie-Einstellungen",
        settingsDescription: "Wählen Sie die optionalen Technologien aus, die Sie erlauben. Notwendige Speichertechnologien können hier nicht deaktiviert werden.",
        essential: "Notwendig",
        essentialDescription: "Notwendige Website-Funktionen und gespeicherte Einstellungen.",
        analytics: "Analyse",
        analyticsDescription: "Hilft uns, die Websitenutzung zu verstehen und unsere Dienste zu verbessern.",
        marketing: "Marketing",
        marketingDescription: "Erlaubt optionale Marketing- und Werbetechnologien.",
        save: "Einstellungen speichern",
        cancel: "Abbrechen"
    },

    ar: {
        title: "خصوصيتك مهمة لدى BITASEC",
        description: "نستخدم التخزين الضروري لتشغيل موقعنا. وبموافقتك، قد نستخدم أيضًا تقنيات اختيارية للتحليلات والتسويق. يمكنك قبول الكل أو رفض الخيارات أو تخصيص تفضيلاتك.",
        privacy: "سياسة الخصوصية",
        policy: "سياسة ملفات تعريف الارتباط",
        accept: "قبول الكل",
        reject: "رفض الاختياري",
        settings: "إعدادات ملفات تعريف الارتباط",
        manage: "تفضيلات ملفات تعريف الارتباط",
        settingsTitle: "إعدادات ملفات تعريف الارتباط",
        settingsDescription: "اختر التقنيات الاختيارية التي تسمح بها. لا يمكن تعطيل التخزين الضروري هنا.",
        essential: "ضروري",
        essentialDescription: "وظائف الموقع الأساسية والتفضيلات المحفوظة.",
        analytics: "التحليلات",
        analyticsDescription: "تساعدنا على فهم استخدام الموقع وتحسين خدماتنا.",
        marketing: "التسويق",
        marketingDescription: "يسمح بتقنيات التسويق والإعلانات الاختيارية.",
        save: "حفظ التفضيلات",
        cancel: "إلغاء"
    },

    zh: {
        title: "BITASEC 重视您的隐私",
        description: "我们使用必要的存储技术来运行网站。经您同意，我们还可能使用可选的分析和营销技术。您可以全部接受、拒绝可选项目或自定义偏好设置。",
        privacy: "隐私政策",
        policy: "Cookie 政策",
        accept: "全部接受",
        reject: "拒绝可选项",
        settings: "Cookie 设置",
        manage: "Cookie 偏好设置",
        settingsTitle: "Cookie 设置",
        settingsDescription: "请选择您允许使用的可选技术。此处无法关闭网站基本功能所必需的存储。",
        essential: "必要",
        essentialDescription: "网站基本功能和已保存的偏好设置。",
        analytics: "分析",
        analyticsDescription: "帮助我们了解网站使用情况并改进服务。",
        marketing: "营销",
        marketingDescription: "允许使用可选的营销和广告技术。",
        save: "保存偏好设置",
        cancel: "取消"
    },

    hi: {
        title: "BITASEC के लिए आपकी गोपनीयता महत्वपूर्ण है",
        description: "हम वेबसाइट चलाने के लिए आवश्यक स्टोरेज का उपयोग करते हैं। आपकी अनुमति से हम वैकल्पिक विश्लेषण और मार्केटिंग तकनीकों का भी उपयोग कर सकते हैं। आप सभी को स्वीकार कर सकते हैं, वैकल्पिक को अस्वीकार कर सकते हैं या अपनी प्राथमिकताएँ चुन सकते हैं।",
        privacy: "गोपनीयता नीति",
        policy: "कुकी नीति",
        accept: "सभी स्वीकार करें",
        reject: "वैकल्पिक अस्वीकार करें",
        settings: "कुकी सेटिंग्स",
        manage: "कुकी प्राथमिकताएँ",
        settingsTitle: "कुकी सेटिंग्स",
        settingsDescription: "चुनें कि आप किन वैकल्पिक तकनीकों की अनुमति देते हैं। वेबसाइट के आवश्यक स्टोरेज को यहाँ बंद नहीं किया जा सकता।",
        essential: "आवश्यक",
        essentialDescription: "वेबसाइट की आवश्यक सुविधाएँ और सहेजी गई प्राथमिकताएँ।",
        analytics: "विश्लेषण",
        analyticsDescription: "वेबसाइट के उपयोग को समझने और सेवाओं को बेहतर बनाने में हमारी मदद करता है।",
        marketing: "मार्केटिंग",
        marketingDescription: "वैकल्पिक मार्केटिंग और विज्ञापन तकनीकों की अनुमति देता है।",
        save: "प्राथमिकताएँ सहेजें",
        cancel: "रद्द करें"
    },

    ja: {
        title: "BITASECはお客様のプライバシーを大切にしています",
        description: "ウェブサイトの運営に必要なストレージを使用します。お客様の許可を得て、任意の分析・マーケティング技術を使用する場合があります。すべて許可するか、任意の技術を拒否するか、設定をカスタマイズできます。",
        privacy: "プライバシーポリシー",
        policy: "Cookieポリシー",
        accept: "すべて許可",
        reject: "任意の項目を拒否",
        settings: "Cookie設定",
        manage: "Cookieの設定",
        settingsTitle: "Cookie設定",
        settingsDescription: "許可する任意の技術を選択してください。サイトの基本機能に必要なストレージはここでは無効にできません。",
        essential: "必須",
        essentialDescription: "ウェブサイトの基本機能と保存された設定。",
        analytics: "分析",
        analyticsDescription: "ウェブサイトの利用状況を把握し、サービスを改善するために使用します。",
        marketing: "マーケティング",
        marketingDescription: "任意のマーケティングおよび広告技術を許可します。",
        save: "設定を保存",
        cancel: "キャンセル"
    }
};

function applyCookieLanguage() {
    let language = "en";

    try {
        language = (
            localStorage.getItem("bitasec_language") || "en"
        ).toLowerCase().split("-")[0];
    } catch (error) {
        // Use English if browser storage is unavailable.
    }

    const t = cookieTranslations[language] || cookieTranslations.en;

    const bannerTitle = banner.querySelector("h2");
    const bannerDescription = banner.querySelector("p");
    const bannerLinks = banner.querySelectorAll(".bitasec-cookie-links a");
    const bannerButtons = banner.querySelectorAll(
        ".bitasec-cookie-actions button"
    );

    bannerTitle.textContent = t.title;
    bannerDescription.textContent = t.description;
    bannerLinks[0].textContent = t.privacy;
    bannerLinks[1].textContent = t.policy;
    bannerButtons[0].textContent = t.accept;
    bannerButtons[1].textContent = t.reject;
    bannerButtons[2].textContent = t.settings;
    manageButton.textContent = t.manage;

    const settingsTitle = settings.querySelector("h2");
    const settingsDescription = settings.querySelector("p");
    const categories = settings.querySelectorAll(".bitasec-cookie-category");
    const settingsButtons = settings.querySelectorAll(
        ".bitasec-cookie-actions button"
    );

    settingsTitle.textContent = t.settingsTitle;
    settingsDescription.textContent = t.settingsDescription;

    const categoryTexts = [
        [t.essential, t.essentialDescription],
        [t.analytics, t.analyticsDescription],
        [t.marketing, t.marketingDescription]
    ];

    categories.forEach((category, index) => {
        const strong = category.querySelector("strong");
        const description = category.querySelector("p");

        strong.textContent = categoryTexts[index][0];
        description.textContent = categoryTexts[index][1];
    });

    settingsButtons[0].textContent = t.save;
    settingsButtons[1].textContent = t.reject;
    settingsButtons[2].textContent = t.cancel;

    // Arabic is read from right to left.
    const direction = language === "ar" ? "rtl" : "ltr";
    banner.dir = direction;
    settings.dir = direction;
    manageButton.dir = direction;
}

// Apply the saved language immediately.
applyCookieLanguage();

// Update immediately when the language selector changes.
document.addEventListener("change", event => {
    if (event.target && event.target.id === "languageSelector") {
        setTimeout(applyCookieLanguage, 0);
    }
});

// Also detect changes made by the existing translation system.
let lastCookieLanguage = "";

function checkCookieLanguage() {
    let currentLanguage = "en";

    try {
        currentLanguage = (
            localStorage.getItem("bitasec_language") || "en"
        ).toLowerCase().split("-")[0];
    } catch (error) {
        // Keep English as the default.
    }

    if (currentLanguage !== lastCookieLanguage) {
        lastCookieLanguage = currentLanguage;
        applyCookieLanguage();
    }
}

checkCookieLanguage();
setInterval(checkCookieLanguage, 500);
    // Public API for other BITASEC scripts.
    window.BITASECCookieConsent = {
        getPreferences() {
            return consent ? { ...consent } : null;
        },

        allows(category) {
            if (category === "necessary") return true;

            return Boolean(consent && consent[category] === true);
        },

        openSettings,

        reset() {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.warn("BITASEC: Could not clear saved preferences.");
            }

            consent = null;
            openBanner();
        }
    };
})();
