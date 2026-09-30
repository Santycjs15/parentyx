import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const registerForm = document.querySelector("#register-form");
    const registerMessage = document.querySelector("#register-message");
    const registrationSection = document.querySelector(".registration-section");
    const profileSurveyPrompt = document.querySelector("#encuesta-perfiladora");
    const headerActions = document.querySelector(".header-actions");
    const accountMenu = document.querySelector(".account-menu");
    const accountToggle = document.querySelector(".account-toggle");
    const accountPanel = document.querySelector(".account-panel");
    const accountEmail = document.querySelector(".account-email");
    const accountLogout = document.querySelector(".account-logout");
    const productsDropdown = document.querySelector(".nav-dropdown");
    const productsToggle = document.querySelector(".nav-dropdown-toggle");
    const premiumLink = document.querySelector(".premium-link");
    const returnedFromSurvey = new URLSearchParams(window.location.search).get("surveyCompleted") === "1";

    // Mantiene el header sólido y visible al hacer scroll.
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    });

    onAuthStateChanged(auth, async (user) => {
        const isAuthenticated = Boolean(user);

        headerActions.classList.toggle("is-authenticated", isAuthenticated);
        accountMenu.classList.toggle("is-visible", isAuthenticated);
        registrationSection.classList.toggle("is-authenticated", isAuthenticated);
        profileSurveyPrompt.hidden = true;
        premiumLink.href = isAuthenticated ? "premium.html" : "login.html";
        premiumLink.classList.toggle("is-unlocked", isAuthenticated);
        premiumLink.setAttribute(
            "aria-label",
            isAuthenticated ? "Contenido premium" : "Contenido premium. Inicia sesión para acceder"
        );

        if (user) {
            accountEmail.textContent = user.email;
            if (returnedFromSurvey) {
                markSurveyAsCompletedLocally(user.uid);
                hideSurveyPrompt(profileSurveyPrompt);
                window.history.replaceState({}, document.title, "index.html");
                return;
            }

            if (hasCompletedSurveyLocally(user.uid)) {
                hideSurveyPrompt(profileSurveyPrompt);
                return;
            }

            try {
                const profileSnapshot = await getDoc(doc(db, "profiles", user.uid));
                if (profileSnapshot.data()?.surveyCompleted === true) {
                    markSurveyAsCompletedLocally(user.uid);
                    hideSurveyPrompt(profileSurveyPrompt);
                } else {
                    profileSurveyPrompt.hidden = false;
                }
            } catch (error) {
                profileSurveyPrompt.hidden = false;
                console.error("No fue posible consultar el perfil del usuario.", error);
            }
        } else {
            closeAccountPanel();
        }
    });

    accountToggle.addEventListener("click", () => {
        const isOpen = accountToggle.getAttribute("aria-expanded") === "true";
        accountToggle.setAttribute("aria-expanded", String(!isOpen));
        accountPanel.hidden = isOpen;
    });

    accountLogout.addEventListener("click", async () => {
        await signOut(auth);
        closeAccountPanel();
    });

    productsToggle.addEventListener("click", () => {
        const isOpen = productsToggle.getAttribute("aria-expanded") === "true";
        productsToggle.setAttribute("aria-expanded", String(!isOpen));
        productsDropdown.classList.toggle("is-open", !isOpen);
    });

    productsDropdown.querySelectorAll(".nav-dropdown-menu a").forEach((link) => {
        link.addEventListener("click", closeProductsDropdown);
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const email = formData.get("email").trim();
        const password = formData.get("password");
        const passwordConfirmation = formData.get("passwordConfirmation");

        if (password !== passwordConfirmation) {
            registerMessage.textContent = "Las contraseñas no coinciden.";
            registerMessage.className = "auth-message is-error";
            return;
        }

        registerMessage.textContent = "Creando tu cuenta...";
        registerMessage.className = "auth-message";

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            registerForm.reset();
            registerMessage.textContent = "Tu cuenta fue creada correctamente.";
            registerMessage.className = "auth-message is-success";
        } catch (error) {
            registerMessage.textContent = getRegistrationErrorMessage(error.code);
            registerMessage.className = "auth-message is-error";
        }
    });
});

function closeAccountPanel() {
    const accountToggle = document.querySelector(".account-toggle");
    const accountPanel = document.querySelector(".account-panel");

    accountToggle.setAttribute("aria-expanded", "false");
    accountPanel.hidden = true;
}

function closeProductsDropdown() {
    const productsDropdown = document.querySelector(".nav-dropdown");
    const productsToggle = document.querySelector(".nav-dropdown-toggle");

    productsDropdown.classList.remove("is-open");
    productsToggle.setAttribute("aria-expanded", "false");
}

function hideSurveyPrompt(prompt) {
    prompt.hidden = true;
    prompt.classList.add("is-survey-completed");
    prompt.setAttribute("aria-hidden", "true");
}

function hasCompletedSurveyLocally(userId) {
    return localStorage.getItem(`parentyx-survey-completed-${userId}`) === "true";
}

function markSurveyAsCompletedLocally(userId) {
    localStorage.setItem(`parentyx-survey-completed-${userId}`, "true");
}

function getRegistrationErrorMessage(errorCode) {
    const messages = {
        "auth/email-already-in-use": "Este correo ya tiene una cuenta registrada.",
        "auth/invalid-email": "Escribe un correo electrónico válido.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres."
    };

    return messages[errorCode] || "No fue posible crear la cuenta. Inténtalo de nuevo.";
}
