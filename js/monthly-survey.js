import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const surveyForm = document.querySelector("#monthly-survey-form");
const surveyMessage = document.querySelector("#monthly-survey-message");
const currentMonth = new Date().toISOString().slice(0, 7);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const previousSurvey = await getDoc(doc(db, "profiles", user.uid, "monthlySurveys", currentMonth));
    if (previousSurvey.exists()) {
        window.location.href = "premium.html";
    }
});

surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const answers = Object.fromEntries(new FormData(surveyForm).entries());
    surveyMessage.textContent = "Guardando tus respuestas...";
    surveyMessage.className = "auth-message";

    try {
        await setDoc(doc(db, "profiles", user.uid, "monthlySurveys", currentMonth), {
            ...answers,
            month: currentMonth,
            submittedAt: serverTimestamp()
        });

        surveyMessage.textContent = "Encuesta enviada correctamente.";
        surveyMessage.className = "auth-message is-success";
        surveyForm.reset();
        window.setTimeout(() => {
            window.location.href = "premium.html";
        }, 900);
    } catch (error) {
        surveyMessage.textContent = "No fue posible guardar la encuesta. Inténtalo de nuevo.";
        surveyMessage.className = "auth-message is-error";
    }
});
