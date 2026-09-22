import { auth } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const registerForm = document.querySelector("#register-form");
    const registerMessage = document.querySelector("#register-message");
    const registrationSection = document.querySelector(".registration-section");
    const headerActions = document.querySelector(".header-actions");
    const accountMenu = document.querySelector(".account-menu");
    const accountToggle = document.querySelector(".account-toggle");
    const accountPanel = document.querySelector(".account-panel");
    const accountEmail = document.querySelector(".account-email");
    const accountLogout = document.querySelector(".account-logout");
    const productsDropdown = document.querySelector(".nav-dropdown");
    const productsToggle = document.querySelector(".nav-dropdown-toggle");

    // Mantiene el header sólido y visible al hacer scroll.
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    });

    onAuthStateChanged(auth, (user) => {
        const isAuthenticated = Boolean(user);

        headerActions.classList.toggle("is-authenticated", isAuthenticated);
        accountMenu.classList.toggle("is-visible", isAuthenticated);
        registrationSection.classList.toggle("is-authenticated", isAuthenticated);

        if (user) {
            accountEmail.textContent = user.email;
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

function getRegistrationErrorMessage(errorCode) {
    const messages = {
        "auth/email-already-in-use": "Este correo ya tiene una cuenta registrada.",
        "auth/invalid-email": "Escribe un correo electrónico válido.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres."
    };

    return messages[errorCode] || "No fue posible crear la cuenta. Inténtalo de nuevo.";
}
