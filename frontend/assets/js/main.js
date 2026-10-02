/*
 * ============================================================
 * BITASEC TECHNOLOGIES
 * Multilingual Website Controller
 * ============================================================
 *
 * Supported languages:
 * en - English
 * fr - French
 * es - Spanish
 * pt - Portuguese
 * sw - Kiswahili
 * de - German
 * ar - Arabic
 * zh - Chinese
 * hi - Hindi
 * ja - Japanese
 *
 * Requirements:
 * - translations.js must load BEFORE this file.
 * - HTML elements should use data-i18n="translation_key".
 * ============================================================
 */

const API_BASE = "http://127.0.0.1:8000/api";

const DEFAULT_LANGUAGE = "en";

const SUPPORTED_LANGUAGES = [
    "en",
    "fr",
    "es",
    "pt",
    "sw",
    "de",
    "ar",
    "zh",
    "hi",
    "ja"
];


/* ============================================================
   START WEBSITE
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    console.log("BITASEC multilingual system starting...");

    setupLanguageSelector();

    applySavedLanguage();

    setupContactForm();

});


/* ============================================================
   LANGUAGE SELECTOR
   ============================================================ */

function setupLanguageSelector() {

    const selector = document.getElementById("languageSelector");

    if (!selector) {
        console.warn(
            "BITASEC: languageSelector was not found on this page."
        );
        return;
    }

    selector.addEventListener("change", function () {

        const selectedLanguage = this.value;

        console.log(
            "BITASEC: Changing language to:",
            selectedLanguage
        );

        changeLanguage(selectedLanguage);

    });
}


/* ============================================================
   CHANGE LANGUAGE
   ============================================================ */

function changeLanguage(language) {

    /*
     * Check that the requested language exists.
     */
    if (!translations) {

        console.error(
            "BITASEC: translations.js was not loaded."
        );

        return;
    }


    if (!SUPPORTED_LANGUAGES.includes(language)) {

        console.warn(
            `BITASEC: Unsupported language "${language}".`
        );

        language = DEFAULT_LANGUAGE;
    }


    if (!translations[language]) {

        console.warn(
            `BITASEC: Translation data for "${language}" does not exist.`
        );

        language = DEFAULT_LANGUAGE;
    }


    /*
     * Save selected language.
     *
     * This means:
     *
     * index.html
     *      ↓
     * services.html
     *      ↓
     * contact.html
     *
     * will continue using the selected language.
     */
    localStorage.setItem(
        "bitasec_language",
        language
    );


    /*
     * Update HTML language.
     */
    document.documentElement.lang = language;


    /*
     * Arabic uses right-to-left direction.
     */
    if (language === "ar") {

        document.documentElement.dir = "rtl";

        document.body.classList.add("rtl");

    } else {

        document.documentElement.dir = "ltr";

        document.body.classList.remove("rtl");

    }


    /*
     * Translate all elements containing:
     *
     * data-i18n="..."
     */
    translatePage(language);


    /*
     * Update language selector.
     */
    updateLanguageSelector(language);


    /*
     * Update page title if a translation exists.
     */
    updatePageTitle(language);


    /*
     * Dispatch an event.
     *
     * Other JavaScript code can listen for:
     *
     * document.addEventListener(
     *     "languageChanged",
     *     function(event) {}
     * );
     */
    document.dispatchEvent(
        new CustomEvent("languageChanged", {
            detail: {
                language: language
            }
        })
    );


    console.log(
        `BITASEC: Website translated to ${language}`
    );
}


/* ============================================================
   TRANSLATE ENTIRE PAGE
   ============================================================ */

function translatePage(language) {

    const dictionary = {
        ...(translations[language] || {}),
        ...(typeof pageTranslations !== "undefined"
            ? (pageTranslations[language] || {})
            : {}),
        ...(typeof teamTranslations !== "undefined"
            ? (teamTranslations[language] || {})
            : {})
    };

    if (!dictionary) {
        console.error(
            `No translation dictionary found for ${language}`
        );
        return;
    }


    /*
     * --------------------------------------------------------
     * 1. NORMAL TEXT
     * --------------------------------------------------------
     *
     * Finds every:
     *
     * data-i18n="..."
     *
     * throughout the page.
     */
    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.getAttribute("data-i18n");

            if (!key) {
                return;
            }


            if (
                dictionary[key] !== undefined &&
                dictionary[key] !== null
            ) {

                /*
                 * innerHTML is intentional here.
                 *
                 * It allows translations such as:
                 *
                 * Secure. Connect. <span>Innovate.</span>
                 *
                 * to keep their HTML formatting.
                 */
                element.innerHTML =
                    dictionary[key];

            } else {

                console.warn(
                    `Missing translation: ${language}.${key}`
                );

            }

        });


    /*
     * --------------------------------------------------------
     * 2. PLACEHOLDERS
     * --------------------------------------------------------
     *
     * Example:
     *
     * <input
     *     data-i18n-placeholder="placeholder_067"
     * >
     */
    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-placeholder"
                );


            if (
                dictionary[key] !== undefined &&
                dictionary[key] !== null
            ) {

                element.placeholder =
                    dictionary[key];

            }

        });


    /*
     * --------------------------------------------------------
     * 3. TITLE ATTRIBUTES
     * --------------------------------------------------------
     *
     * Example:
     *
     * data-i18n-title="some_key"
     */
    document
        .querySelectorAll("[data-i18n-title]")
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-title"
                );


            if (
                dictionary[key] !== undefined &&
                dictionary[key] !== null
            ) {

                element.title =
                    dictionary[key];

            }

        });


    /*
     * --------------------------------------------------------
     * 4. ARIA LABELS
     * --------------------------------------------------------
     *
     * Useful for accessibility.
     */
    document
        .querySelectorAll("[data-i18n-aria-label]")
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-aria-label"
                );


            if (
                dictionary[key] !== undefined &&
                dictionary[key] !== null
            ) {

                element.setAttribute(
                    "aria-label",
                    dictionary[key]
                );

            }

        });


    /*
     * --------------------------------------------------------
     * 5. SELECT OPTIONS
     * --------------------------------------------------------
     *
     * Allows service options to be translated.
     *
     * Example:
     *
     * <option data-i18n="contact_text_072">
     *     Cybersecurity
     * </option>
     */
    document
        .querySelectorAll("option[data-i18n]")
        .forEach(option => {

            const key =
                option.getAttribute("data-i18n");


            if (
                dictionary[key] !== undefined &&
                dictionary[key] !== null
            ) {

                option.textContent =
                    dictionary[key];

            }

        });


    /*
     * --------------------------------------------------------
     * 6. DOCUMENT META DESCRIPTION
     * --------------------------------------------------------
     *
     * If later you add:
     *
     * data-i18n="..."
     *
     * to the meta description, it will also translate.
     */
    document
        .querySelectorAll(
            'meta[name="description"][data-i18n]'
        )
        .forEach(meta => {

            const key =
                meta.getAttribute("data-i18n");


            if (
                dictionary[key] !== undefined &&
                dictionary[key] !== null
            ) {

                meta.setAttribute(
                    "content",
                    dictionary[key]
                );

            }

        });
}


/* ============================================================
   UPDATE SELECTOR
   ============================================================ */

function updateLanguageSelector(language) {

    const selector =
        document.getElementById(
            "languageSelector"
        );


    if (!selector) {
        return;
    }


    /*
     * Make sure the selector displays
     * the currently selected language.
     */
    selector.value = language;

}


/* ============================================================
   APPLY SAVED LANGUAGE
   ============================================================ */

function applySavedLanguage() {

    let savedLanguage =
        localStorage.getItem(
            "bitasec_language"
        );


    /*
     * If there is no saved language,
     * use English.
     */
    if (!savedLanguage) {

        savedLanguage =
            DEFAULT_LANGUAGE;

    }


    /*
     * If saved language is invalid,
     * use English.
     */
    if (
        !SUPPORTED_LANGUAGES.includes(
            savedLanguage
        )
    ) {

        savedLanguage =
            DEFAULT_LANGUAGE;

    }


    /*
     * Make sure the translation exists.
     */
    if (
        !translations ||
        !translations[savedLanguage]
    ) {

        savedLanguage =
            DEFAULT_LANGUAGE;

    }


    changeLanguage(savedLanguage);

}


/* ============================================================
   GET CURRENT LANGUAGE
   ============================================================ */

function getCurrentLanguage() {

    return (
        localStorage.getItem(
            "bitasec_language"
        ) ||
        DEFAULT_LANGUAGE
    );

}


/* ============================================================
   GET TRANSLATION
   ============================================================ */

function getCurrentTranslation(
    key,
    fallback = ""
) {

    const language =
        getCurrentLanguage();


    if (
        translations &&
        translations[language] &&
        translations[language][key] !== undefined
    ) {

        return translations[language][key];

    }


    /*
     * Try English before using fallback.
     */
    if (
        translations &&
        translations.en &&
        translations.en[key] !== undefined
    ) {

        return translations.en[key];

    }


    return fallback;

}


/* ============================================================
   CONTACT FORM
   ============================================================ */

function setupContactForm() {

    const form = document.getElementById("contactForm");

    /*
     * Not every page contains the contact form.
     */
    if (!form) {
        return;
    }

    const messageBox =
        document.getElementById("formMessage");

    const submitButton =
        form.querySelector("button[type='submit']");

    const serviceField =
        document.getElementById("service");

    const nameField =
        document.getElementById("name");

    const emailField =
        document.getElementById("email");

    const companyField =
        document.getElementById("company");

    const messageField =
        document.getElementById("message");


    /*
     * Display a message to the visitor.
     */
    function showFormMessage(message, type) {

        if (!messageBox) {
            return;
        }

        messageBox.textContent = message;

        messageBox.className = "contact-form-message";

        if (type) {
            messageBox.classList.add(type);
        }

        messageBox.setAttribute(
            "role",
            type === "error"
                ? "alert"
                : "status"
        );

        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    /*
     * Clear previous validation state.
     */
    function clearValidation() {

        [
            nameField,
            emailField,
            companyField,
            serviceField,
            messageField
        ].forEach(field => {

            if (!field) {
                return;
            }

            field.classList.remove(
                "input-error"
            );

            field.removeAttribute(
                "aria-invalid"
            );
        });
    }


    /*
     * Mark a field as invalid.
     */
    function markInvalid(field) {

        if (!field) {
            return;
        }

        field.classList.add("input-error");

        field.setAttribute(
            "aria-invalid",
            "true"
        );
    }


    /*
     * Basic client-side validation.
     */
    function validateForm() {

        clearValidation();

        let valid = true;

        const name =
            nameField?.value.trim() || "";

        const email =
            emailField?.value.trim() || "";

        const service =
            serviceField?.value.trim() || "";

        const message =
            messageField?.value.trim() || "";


        if (name.length < 2) {

            markInvalid(nameField);

            valid = false;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            markInvalid(emailField);

            valid = false;
        }


        if (!service) {

            markInvalid(serviceField);

            valid = false;
        }


        if (message.length < 10) {

            markInvalid(messageField);

            valid = false;
        }


        if (!valid) {

            showFormMessage(
                getCurrentTranslation(
                    "form_validation",
                    "Please correct the highlighted fields."
                ),
                "error"
            );
        }

        return valid;
    }


    /*
     * Remove error state when the visitor edits a field.
     */
    [
        nameField,
        emailField,
        companyField,
        serviceField,
        messageField
    ].forEach(field => {

        if (!field) {
            return;
        }

        field.addEventListener(
            "input",
            () => {

                field.classList.remove(
                    "input-error"
                );

                field.removeAttribute(
                    "aria-invalid"
                );

                if (messageBox) {
                    messageBox.textContent = "";
                    messageBox.className =
                        "contact-form-message";
                }
            }
        );

        field.addEventListener(
            "change",
            () => {

                field.classList.remove(
                    "input-error"
                );

                field.removeAttribute(
                    "aria-invalid"
                );
            }
        );
    });


    /*
     * Submit form.
     */
    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            if (!validateForm()) {
                return;
            }


            /*
             * Prevent duplicate submissions.
             */
            if (submitButton) {

                submitButton.disabled = true;

                submitButton.classList.add(
                    "is-loading"
                );

                submitButton.setAttribute(
                    "aria-busy",
                    "true"
                );

                submitButton.dataset.originalText =
                    submitButton.textContent.trim();

                submitButton.textContent =
                    getCurrentTranslation(
                        "form_sending",
                        "Sending..."
                    );
            }


            showFormMessage(
                getCurrentTranslation(
                    "form_processing",
                    "Sending your request..."
                ),
                "loading"
            );


            const data = {

                name:
                    nameField?.value.trim() || "",

                email:
                    emailField?.value.trim() || "",

                company:
                    companyField?.value.trim() || "",

                service:
                    serviceField?.value.trim() || "",

                message:
                    messageField?.value.trim() || ""
            };


            try {

                const response =
                    await fetch(
                        `${API_BASE}/contact/`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                let result = {};

                try {

                    result =
                        await response.json();

                } catch (jsonError) {

                    result = {};
                }


                /*
                 * Backend validation errors.
                 */
                if (!response.ok) {

                    const errors =
                        result.errors || {};

                    const errorMessages = [];


                    Object.entries(errors)
                        .forEach(
                            ([field, messages]) => {

                                const fieldElement =
                                    document.getElementById(
                                        field
                                    );

                                markInvalid(
                                    fieldElement
                                );

                                if (
                                    Array.isArray(messages)
                                ) {

                                    messages.forEach(
                                        message => {
                                            errorMessages.push(
                                                message
                                            );
                                        }
                                    );

                                } else {

                                    errorMessages.push(
                                        String(messages)
                                    );
                                }
                            }
                        );


                    const errorText =
                        errorMessages.length > 0
                            ? errorMessages.join(" ")
                            : (
                                result.message ||
                                getCurrentTranslation(
                                    "form_error",
                                    "Unable to send your request. Please try again."
                                )
                            );


                    throw new Error(errorText);
                }


                /*
                 * SUCCESS
                 */
                showFormMessage(
                    result.message ||
                    getCurrentTranslation(
                        "form_success",
                        "Your request has been sent successfully. We will get back to you."
                    ),
                    "success"
                );


                form.reset();

                clearValidation();


                /*
                 * Keep the success message visible
                 * and restore the button.
                 */
                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.classList.remove(
                        "is-loading"
                    );

                    submitButton.removeAttribute(
                        "aria-busy"
                    );

                    submitButton.textContent =
                        submitButton.dataset.originalText ||
                        getCurrentTranslation(
                            "contact_text_053",
                            "Send Request"
                        );
                }


            } catch (error) {

                console.error(
                    "BITASEC contact form error:",
                    error
                );


                showFormMessage(
                    error.message ||
                    getCurrentTranslation(
                        "form_error",
                        "Unable to send your request. Please try again."
                    ),
                    "error"
                );


                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.classList.remove(
                        "is-loading"
                    );

                    submitButton.removeAttribute(
                        "aria-busy"
                    );

                    submitButton.textContent =
                        submitButton.dataset.originalText ||
                        getCurrentTranslation(
                            "contact_text_053",
                            "Send Request"
                        );
                }
            }
        }
    );
}

/* ============================================================
   PAGE TITLE
   ============================================================ */

function updatePageTitle(language) {

    /*
     * Optional title translation.
     *
     * You can add these keys to translations.js later:
     *
     * page_title_index
     * page_title_about
     * page_title_services
     * etc.
     */

    if (
        !translations[language]
    ) {
        return;
    }


    const path =
        window.location.pathname
            .split("/")
            .pop();


    const pageNames = {

        "index.html":
            "page_title_index",

        "about.html":
            "page_title_about",

        "services.html":
            "page_title_services",

        "projects.html":
            "page_title_projects",

        "training.html":
            "page_title_training",

        "faq.html":
            "page_title_faq",

        "contact.html":
            "page_title_contact"

    };


    const key =
        pageNames[path];


    if (
        key &&
        translations[language][key]
    ) {

        document.title =
            translations[language][key];

    }

}


/* ============================================================
   GLOBAL FUNCTIONS
   ============================================================ */

window.changeLanguage =
    changeLanguage;

window.getCurrentLanguage =
    getCurrentLanguage;

window.getCurrentTranslation =
    getCurrentTranslation;
