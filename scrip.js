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