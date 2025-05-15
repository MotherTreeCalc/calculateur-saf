// === HELPERS.JS ===
// Fonctions utilitaires pour le calculateur SAF Mother Tree

/**
 * Crée un élément avec des attributs et du texte facultatifs
 * @param {string} tag - Le type de balise (ex: 'div', 'span')
 * @param {Object} [attrs] - Les attributs HTML (id, class, etc.)
 * @param {string} [text] - Contenu textuel
 * @returns {HTMLElement}
 */
function creerElement(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    for (let attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
    }
    if (text) el.textContent = text;
    return el;
}

/**
 * Vérifie si une valeur est un nombre valide
 * @param {any} val
 * @returns {boolean}
 */
function estNombre(val) {
    return typeof val === "number" && !isNaN(val);
}

/**
 * Applique un message d’erreur accessible à un élément cible
 * @param {HTMLElement} cible - Élément DOM où injecter le message
 * @param {string} message
 */
function afficherErreur(cible, message) {
    cible.setAttribute("role", "alert");
    cible.setAttribute("aria-live", "assertive");
    cible.textContent = message;
    cible.style.color = "red";
}

/**
 * Réinitialise complètement le formulaire et les résultats
 */
function reinitialiserCalculateur() {
    document.getElementById("form-parametres").reset();
    const conteneur = document.getElementById("huiles-container");
    conteneur.querySelectorAll("select").forEach(sel => sel.selectedIndex = 0);
    conteneur.querySelectorAll("input[type='number']").forEach(inp => inp.value = "");
    document.getElementById("proprietes-techniques").innerHTML = "";
    document.getElementById("conformite").innerHTML = "";
    document.getElementById("ratio-douce-dure").innerHTML = "";
    document.getElementById("erreurs").textContent = "";
}

