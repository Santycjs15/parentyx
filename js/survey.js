import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const surveyForm = document.querySelector("#profile-survey-form");
const surveyMessage = document.querySelector("#survey-message");

surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(surveyForm);
    const answers = Object.fromEntries(formData.entries());
    const passwordConfirmation = answers.passwordConfirmation;

    if (answers.password !== passwordConfirmation) {
        surveyMessage.textContent = "Las contraseñas no coinciden.";
        surveyMessage.className = "auth-message is-error";
        return;
    }

    delete answers.passwordConfirmation;

    surveyMessage.textContent = "Guardando tus respuestas...";
    surveyMessage.className = "auth-message";

    try {
        let user = auth.currentUser;
        if (!user) {
            const credentials = await createUserWithEmailAndPassword(auth, answers.email, answers.password);
            user = credentials.user;
        }

        delete answers.password;
        await setDoc(doc(db, "profiles", user.uid), {
            ...answers,
            surveyCompleted: true,
            surveyCompletedAt: serverTimestamp(),
            email: user.email
        }, { merge: true });

        surveyMessage.textContent = "Encuesta enviada correctamente.";
        surveyMessage.className = "auth-message is-success";
        localStorage.setItem(`parentyx-survey-completed-${user.uid}`, "true");
        surveyForm.reset();
        window.setTimeout(() => {
            window.location.href = "index.html";
        }, 900);
    } catch (error) {
        surveyMessage.textContent = getRegistrationErrorMessage(error.code);
        surveyMessage.className = "auth-message is-error";
    }
});

function getRegistrationErrorMessage(errorCode) {
    const messages = {
        "auth/email-already-in-use": "Este correo ya tiene una cuenta registrada.",
        "auth/invalid-email": "Escribe un correo electrónico válido.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres."
    };

    return messages[errorCode] || "No fue posible completar el registro. Inténtalo de nuevo.";
}
