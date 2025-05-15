// === Toggle thème clair / sombre ===6 menus
document.addEventListener("DOMContentLoaded", () => {
    const themeIcon = document.getElementById("toggle-theme-icon");

    function majIconeTheme(theme) {
        if (theme === "dark") {
            themeIcon.src = "assets/img/icon-sun.svg";
            themeIcon.alt = "Passer au thème clair";
        } else {
            themeIcon.src = "assets/img/icon-moon.svg";
            themeIcon.alt = "Passer au thème sombre";
        }
    }

    themeIcon.addEventListener("click", () => {
        const courant = document.documentElement.getAttribute("data-theme") || "light";
        const suivant = courant === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", suivant);
        localStorage.setItem("theme", suivant);
        majIconeTheme(suivant);
    });

    themeIcon.addEventListener("keypress", (e) => {
        if (e.key === "Enter") themeIcon.click();
    });

    const themeSauvegarde = localStorage.getItem("theme");
    const themeInitial = themeSauvegarde || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", themeInitial);
    majIconeTheme(themeInitial);

    // === Logique du calculateur SAF Mother Tree ===
    const container = document.getElementById("huiles-container");
    const erreurs = document.getElementById("erreurs");
    const listeHuiles = window.listeHuilesMotherTree;
    const selects = [];
    const inputs = [];

    function creerBlocHuile(index) {
        const div = document.createElement("div");
        div.className = "huile-item";

        const etiquette = document.createElement("label");
        etiquette.textContent = `Huile #${index + 1}`;
        etiquette.setAttribute("for", `huile-${index}`);

        const select = document.createElement("select");
        select.id = `huile-${index}`;
        select.dataset.index = index;
        select.setAttribute("aria-label", `Sélection de l'huile #${index + 1}`);
        select.innerHTML = `<option value="">-- Choisir une huile --</option>` +
            listeHuiles.map(h => {
                const classe = h.categorie === "dure" ? "dure" : "douce";
                return `<option value="${h.nom}" class="${classe}">${h.nom}</option>`;
            }).join("");

        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = "%";
        input.min = 0;
        input.max = 100;
        input.step = 0.1;
        input.setAttribute("aria-label", `Pourcentage de l'huile #${index + 1}`);

        select.addEventListener("change", calculerEtAfficher);
        input.addEventListener("input", calculerEtAfficher);

        div.appendChild(etiquette);
        div.appendChild(select);
        div.appendChild(input);
        container.appendChild(div);

        selects.push(select);
        inputs.push(input);
    }

    creerBlocHuile(0);

    // === Ajouts dynamiques par phase ===
    function afficherAjoutsParPhase(phase, containerId) {
        const conteneur = document.getElementById(containerId);
        if (!conteneur) return;
        conteneur.innerHTML = "";

        const groupes = {};
        window.listeAjoutsMotherTree
            .filter(ajout => ajout.phase === phase)
            .forEach(ajout => {
                if (!groupes[ajout.type]) groupes[ajout.type] = [];
                groupes[ajout.type].push(ajout);
            });

        Object.entries(groupes).forEach(([type, ajouts]) => {
            const groupeDiv = document.createElement("div");
            groupeDiv.className = "groupe-ajout";

            const titre = document.createElement("h3");
            titre.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            groupeDiv.appendChild(titre);

            const zoneAjout = document.createElement("div");
            zoneAjout.className = "ajout-zone";

            let compteur = 1;

            const creerLigneAjout = () => {
                const ligne = document.createElement("div");
                ligne.className = "ajout-item";

                const select = document.createElement("select");
                select.classList.add("menu-style");
                select.innerHTML = `<option value="">Choisir un ajout</option>` +
                    ajouts.map(a => `<option value="${a.nom}">${a.nom}</option>`).join("");

                const input = document.createElement("input");
                input.type = "number";
                input.min = 0;
                input.step = 0.1;
                input.placeholder = "g";
                input.classList.add("menu-style");

                ligne.appendChild(select);
                ligne.appendChild(input);
                zoneAjout.appendChild(ligne);

                new TomSelect(select, {
                    maxItems: 1,
                    placeholder: "Choisir un ajout...",
                    dropdownClass: 'dropdown-ajouts',
                    controlClass: 'control-ajouts'
                });
            };

            creerLigneAjout();

            const bouton = document.createElement("button");
            bouton.textContent = `Ajouter un ${type}`;
            bouton.type = "button";
            bouton.addEventListener("click", () => {
                if (compteur < 6) {
                    creerLigneAjout();
                    compteur++;
                }
            });

            groupeDiv.appendChild(zoneAjout);
            groupeDiv.appendChild(bouton);
            conteneur.appendChild(groupeDiv);
        });
    }

    afficherAjoutsParPhase("aqueuse", "phase-aqueuse");
    afficherAjoutsParPhase("trace", "ajouts-trace");

    document.getElementById("ajouter-huile").addEventListener("click", () => {
        if (selects.length < 10) {
            creerBlocHuile(selects.length);
            if (selects.length >= 10) {
                const bouton = document.getElementById("ajouter-huile");
                bouton.disabled = true;
                bouton.textContent = "Limite atteinte (10 huiles)";
            }
        }
    });

    document.getElementById("btn-reset").addEventListener("click", () => {
        selects.forEach(select => {
            select.tomselect?.clear();
        });
        inputs.forEach(input => input.value = "");
        document.getElementById("poidsTotal").value = 1000;
        document.getElementById("surgras").value = 8;
        document.getElementById("ratioEau").value = 0.35;
        document.getElementById("proprietes-techniques").innerHTML = "";
        document.getElementById("conformite").innerHTML = "";
        document.getElementById("ratio-douce-dure").innerHTML = "";
        document.getElementById("erreurs").textContent = "";
        calculerEtAfficher();
    });

    document.getElementById("poidsTotal").addEventListener("input", calculerEtAfficher);
    document.getElementById("surgras").addEventListener("input", calculerEtAfficher);
    document.getElementById("ratioEau").addEventListener("input", calculerEtAfficher);

    const boutons = document.querySelectorAll(".onglets-titres button");
    const contenus = document.querySelectorAll(".onglets-contenu");
    boutons.forEach(bouton => {
        bouton.addEventListener("click", () => {
            boutons.forEach(b => b.classList.remove("actif"));
            contenus.forEach(c => c.classList.remove("actif"));
            bouton.classList.add("actif");
            const onglet = document.getElementById("onglet-" + bouton.dataset.tab);
            if (onglet) onglet.classList.add("actif");
        });
    });
});
