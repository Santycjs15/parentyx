import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const registrationSection = document.querySelector(".registration-section");
    const headerActions = document.querySelector(".header-actions");
    const accountMenu = document.querySelector(".account-menu");
    const accountToggle = document.querySelector(".account-toggle");
    const accountPanel = document.querySelector(".account-panel");
    const accountEmail = document.querySelector(".account-email");
    const accountLogout = document.querySelector(".account-logout");
    const premiumLink = document.querySelector(".premium-link");
    const monthlySurveyHome = document.querySelector(".monthly-survey-home");
    const currentMonth = new Date().toISOString().slice(0, 7);

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
        monthlySurveyHome.hidden = true;
        premiumLink.href = isAuthenticated ? "#contenido-premium" : "login.html";
        premiumLink.classList.toggle("is-unlocked", isAuthenticated);
        premiumLink.setAttribute(
            "aria-label",
            isAuthenticated ? "Contenido premium" : "Contenido premium. Inicia sesión para acceder"
        );

        if (user) {
            accountEmail.textContent = user.email;
            try {
                const surveySnapshot = await getDoc(doc(db, "profiles", user.uid, "monthlySurveys", currentMonth));
                monthlySurveyHome.hidden = surveySnapshot.exists();
            } catch (error) {
                monthlySurveyHome.hidden = false;
                console.error("No fue posible consultar la encuesta mensual.", error);
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
});

function closeAccountPanel() {
    const accountToggle = document.querySelector(".account-toggle");
    const accountPanel = document.querySelector(".account-panel");

    accountToggle.setAttribute("aria-expanded", "false");
    accountPanel.hidden = true;
}



