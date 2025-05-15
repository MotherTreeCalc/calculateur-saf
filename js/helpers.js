// === HELPERS.JS ===
// Fonctions utilitaires pour le calculateur SAF Mother Tree

/**
 * Cr�e un �l�ment avec des attributs et du texte facultatifs
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
 * V�rifie si une valeur est un nombre valide
 * @param {any} val
 * @returns {boolean}
 */
function estNombre(val) {
    return typeof val === "number" && !isNaN(val);
}

/**
 * Applique un message d�erreur accessible � un �l�ment cible
 * @param {HTMLElement} cible - �l�ment DOM o� injecter le message
 * @param {string} message
 */
function afficherErreur(cible, message) {
    cible.setAttribute("role", "alert");
    cible.setAttribute("aria-live", "assertive");
    cible.textContent = message;
    cible.style.color = "red";
}

/**
 * R�initialise compl�tement le formulaire et les r�sultats
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

