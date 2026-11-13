const themeToggle = document.getElementById("boton-tema");
const themeStorageKey = "antarion-theme";
const savedTheme = localStorage.getItem(themeStorageKey);

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.checked = theme === "oscuro";
}

setTheme(savedTheme === "oscuro" ? "oscuro" : "claro");

themeToggle.addEventListener("change", () => {
    const theme = themeToggle.checked ? "oscuro" : "claro";
    setTheme(theme);
    localStorage.setItem(themeStorageKey, theme);
});

const readButton = document.getElementById("leer-pagina");
const readingStatus = document.getElementById("estado-lectura");
let currentUtterance = null;

function setReadingState(isReading) {
    readButton.setAttribute("aria-pressed", String(isReading));
    readButton.setAttribute("aria-label", isReading ? "Detener lectura" : "Leer el contenido de la página");
    readButton.innerHTML = `<i class="bi ${isReading ? "bi-stop-fill" : "bi-headphones"}" aria-hidden="true"></i>`;
}

if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    readButton.addEventListener("click", () => {
        if (currentUtterance) {
            currentUtterance.onend = null;
            currentUtterance.onerror = null;
            window.speechSynthesis.cancel();
            currentUtterance = null;
            setReadingState(false);
            readingStatus.textContent = "Lectura detenida.";
            return;
        }

        const pageText = Array.from(document.querySelectorAll("header, main, footer"))
            .map((section) => section.innerText.trim())
            .filter(Boolean)
            .join(". ");

        if (!pageText) {
            readingStatus.textContent = "No se encontró contenido para leer.";
            return;
        }

        const utterance = new SpeechSynthesisUtterance(pageText);
        utterance.lang = "es-AR";
        utterance.onend = () => {
            if (currentUtterance !== utterance) return;
            currentUtterance = null;
            setReadingState(false);
            readingStatus.textContent = "Terminó la lectura.";
        };
        utterance.onerror = () => {
            if (currentUtterance !== utterance) return;
            currentUtterance = null;
            setReadingState(false);
            readingStatus.textContent = "No se pudo completar la lectura.";
        };

        currentUtterance = utterance;
        setReadingState(true);
        readingStatus.textContent = "Comenzó la lectura.";
        window.speechSynthesis.speak(utterance);
    });
} else {
    readButton.disabled = true;
    readButton.title = "La lectura en voz alta no está disponible en este navegador.";
    readingStatus.textContent = "La lectura en voz alta no está disponible en este navegador.";
}