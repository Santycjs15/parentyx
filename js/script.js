import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const registrationSection = document.querySelector(".registration-section");
    const headerActions = document.querySelector(".header-actions");
    const accountMenu = document.querySelector(".account-menu");
    const accountToggle = document.querySelector(".account-toggle");
    const accountPanel = document.querySelector(".account-panel");
    const accountEmail = document.querySelector(".account-email");
    const accountLogout = document.querySelector(".account-logout");
    const productsDropdown = document.querySelector(".nav-dropdown");
    const productsToggle = document.querySelector(".nav-dropdown-toggle");
    const premiumLink = document.querySelector(".premium-link");

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
        premiumLink.href = isAuthenticated ? "premium.html" : "login.html";
        premiumLink.classList.toggle("is-unlocked", isAuthenticated);
        premiumLink.setAttribute(
            "aria-label",
            isAuthenticated ? "Contenido premium" : "Contenido premium. Inicia sesión para acceder"
        );

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


