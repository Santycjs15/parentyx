import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const privateContent = document.querySelector(".private-content");
const accessMessage = document.querySelector(".access-message");
const moduleButtons = document.querySelectorAll(".module-button");
const moduleLabel = document.querySelector(".module-content .eyebrow");
const moduleTitle = document.querySelector("#module-title");
const moduleDescription = document.querySelector("#module-description");
const moduleTopics = document.querySelector("#module-topics");
const monthlySurveyPremium = document.querySelector(".monthly-survey-premium");
const currentMonth = new Date().toISOString().slice(0, 7);

const modules = {
    regulacion: {
        label: "MÓDULO I",
        title: "Regulación y Afecto",
        description: "Aprende a reconocer y acompañar las emociones de los niños y niñas, construyendo respuestas sensibles que favorezcan la seguridad emocional.",
        topics: [
            "Reconocimiento y validación de las emociones.",
            "Estrategias para acompañar momentos de desregulación.",
            "El afecto como base para el desarrollo emocional."
        ]
    },
    coherencia: {
        label: "MÓDULO II",
        title: "Coherencia parental",
        description: "Fortalece la claridad y consistencia de tus respuestas para establecer límites respetuosos que ayuden a los niños a sentirse seguros.",
        topics: [
            "Límites claros y consecuentes.",
            "Acuerdos entre los adultos cuidadores.",
            "Comunicación respetuosa en la vida cotidiana."
        ]
    },
    vinculo: {
        label: "MÓDULO III",
        title: "Vínculo y sensibilidad",
        description: "Profundiza en la importancia de responder con sensibilidad a las necesidades de los niños y niñas para construir vínculos familiares seguros.",
        topics: [
            "Escucha activa y presencia emocional.",
            "Señales de necesidad de cuidado y conexión.",
            "Prácticas para fortalecer el vínculo familiar."
        ]
    },
    entorno: {
        label: "MÓDULO IV",
        title: "Entorno y estimulación",
        description: "Descubre cómo crear entornos familiares que promuevan el aprendizaje, el bienestar y el desarrollo integral durante la primera infancia.",
        topics: [
            "Entornos seguros, afectivos y predecibles.",
            "Estimulación a través del juego y la interacción.",
            "Rutinas que favorecen el desarrollo infantil."
        ]
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        privateContent.hidden = false;
        accessMessage.hidden = true;
        if (monthlySurveyPremium) {
            const surveySnapshot = await getDoc(doc(db, "profiles", user.uid, "monthlySurveys", currentMonth));
            monthlySurveyPremium.hidden = surveySnapshot.exists();
        }
        return;
    }

    privateContent.hidden = true;
    accessMessage.hidden = false;
});

moduleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const module = modules[button.dataset.module];

        moduleButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        moduleLabel.textContent = module.label;
        moduleTitle.textContent = module.title;
        moduleDescription.textContent = module.description;
        moduleTopics.innerHTML = module.topics.map((topic) => `<li>${topic}</li>`).join("");
    });
});
