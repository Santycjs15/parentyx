import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const surveyForm = document.querySelector("#profile-survey-form");
const surveyMessage = document.querySelector("#survey-message");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData(surveyForm);
    const answers = Object.fromEntries(formData.entries());

    surveyMessage.textContent = "Guardando tus respuestas...";
    surveyMessage.className = "auth-message";

    try {
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
            window.location.href = "index.html?surveyCompleted=1";
        }, 900);
    } catch (error) {
        surveyMessage.textContent = "No fue posible guardar la encuesta. Inténtalo de nuevo.";
        surveyMessage.className = "auth-message is-error";
    }
});
