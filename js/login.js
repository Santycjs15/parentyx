import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    loginMessage.textContent = "Iniciando sesión...";
    loginMessage.className = "auth-message";

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html";
    } catch (error) {
        loginMessage.textContent = getLoginErrorMessage(error.code);
        loginMessage.className = "auth-message is-error";
    }
});

function getLoginErrorMessage(errorCode) {
    const messages = {
        "auth/invalid-credential": "El correo o la contraseña no son correctos.",
        "auth/invalid-email": "Escribe un correo electrónico válido.",
        "auth/user-disabled": "Esta cuenta está deshabilitada."
    };

    return messages[errorCode] || "No fue posible iniciar sesión. Inténtalo de nuevo.";
}
