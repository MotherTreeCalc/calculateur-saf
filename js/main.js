// === Toggle thème clair / sombre ===6 menus
document.addEventListener("DOMContentLoaded", () => {
    const themeIcon = document.getElementById("toggle-theme-icon");

    // Fonction pour appliquer l'icône appropriée
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

        // Créer un bloc pour une huile
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

    // Initialiser avec 1 bloc
    creerBlocHuile(0);

    // === Ajouts dynamiques pour la phase aqueuse ===
    const zoneAqueuse = document.getElementById("phase-aqueuse");

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
          // Vide tous les selects et inputs d’huile
          selects.forEach(select => {
              select.tomselect.clear(); // Efface le choix actif de Tom Select
          });

          inputs.forEach(input => {
              input.value = "";
          });

          // Réinitialise les champs principaux
          document.getElementById("poidsTotal").value = 1000;
          document.getElementById("surgras").value = 8;
          document.getElementById("ratioEau").value = 0.35;

          // Vide les sections de résultats
          document.getElementById("proprietes-techniques").innerHTML = "";
          document.getElementById("conformite").innerHTML = "";
          document.getElementById("ratio-douce-dure").innerHTML = "";
          document.getElementById("erreurs").textContent = "";

          calculerEtAfficher(); // Pour mettre à jour tout
      });

  document.getElementById("poidsTotal").addEventListener("input", calculerEtAfficher);
  document.getElementById("surgras").addEventListener("input", calculerEtAfficher);
  document.getElementById("ratioEau").addEventListener("input", calculerEtAfficher);

    function calculerEtAfficher() {
        const poidsHE = parseFloat(document.getElementById("he")?.value || 0);
        const poidsArgile = parseFloat(document.getElementById("argile")?.value || 0);
        const poidsMiel = parseFloat(document.getElementById("miel")?.value || 0);
        const poidsCharbon = parseFloat(document.getElementById("charbon")?.value || 0);
        const poidsAvoine = parseFloat(document.getElementById("avoine")?.value || 0);
        const poidsExfoliant = parseFloat(document.getElementById("exfoliant")?.value || 0);

        const poidsLait = parseFloat(document.getElementById("lait")?.value || 0);
        const poidsInfusion = parseFloat(document.getElementById("infusion")?.value || 0);
    const data = [];
    let totalPourcentage = 0;

        for (let i = 0; i < selects.length; i++) {
      const nom = selects[i].value;
      const pct = parseFloat(inputs[i].value);
      if (!nom || isNaN(pct) || pct <= 0) continue;
      const huile = listeHuiles.find(h => h.nom === nom);
      if (huile) {
        data.push({ ...huile, pourcentage: pct });
        totalPourcentage += pct;
      }
    }

    if (totalPourcentage === 0) {
      erreurs.textContent = "Veuillez entrer au moins une huile avec un pourcentage.";
      return;
    }

    if (Math.abs(totalPourcentage - 100) > 0.5) {
      erreurs.textContent = `Le total des pourcentages doit être proche de 100%. Actuel: ${totalPourcentage.toFixed(1)}%`;
      return;
    }

    erreurs.textContent = "";

    const poidsTotal = parseFloat(document.getElementById("poidsTotal").value);
    const surgras = parseFloat(document.getElementById("surgras").value);
    const ratioEau = parseFloat(document.getElementById("ratioEau").value);

    const resultats = window.calculerProprietes(data, poidsTotal, surgras, ratioEau);
    const conformite = window.analyserConformite(resultats);

        afficherProprietes(resultats);
        if (poidsLait > 0 || poidsInfusion > 0) {
            const divPhaseAqueuse = document.createElement("div");
            divPhaseAqueuse.innerHTML = `
    <h3>Détail de la phase aqueuse</h3>
    <ul>
      ${poidsLait > 0 ? `<li>Lait : ${poidsLait} g</li>` : ""}
      ${poidsInfusion > 0 ? `<li>Infusion : ${poidsInfusion} g</li>` : ""}
      <li>Eau restante : ${(resultats.masseEau - poidsLait - poidsInfusion).toFixed(1)} g</li>
    </ul>
  `;
            document.getElementById("proprietes-techniques").appendChild(divPhaseAqueuse);
        }
        const ajoutDiv = document.createElement("div");
        ajoutDiv.innerHTML = `
    <h3>Ajouts</h3>
  <ul>
    <li>Huiles essentielles : ${poidsHE} g</li>
    <li>Argile : ${poidsArgile} g</li>
    <li>Miel : ${poidsMiel} g</li>
    <li>Charbon : ${poidsCharbon} g</li>
    <li>Avoine : ${poidsAvoine} g</li>
    <li>Exfoliants : ${poidsExfoliant} g</li>
  </ul>
`;
        document.getElementById("proprietes-techniques").appendChild(ajoutDiv);
    afficherConformite(conformite);
    afficherRatioDouceDure(data);
  }

  function genererBarrePropriete(nom, valeur, min, max) {
    const pivot = (min + max) / 2;
    const minAffichage = pivot - 100;
    const maxAffichage = pivot + 100;
    let pourcentage = ((valeur - minAffichage) / (maxAffichage - minAffichage)) * 100;
    pourcentage = Math.max(0, Math.min(100, pourcentage));

    const positionIdealMin = ((min - minAffichage) / (maxAffichage - minAffichage)) * 100;
    const positionIdealMax = ((max - minAffichage) / (maxAffichage - minAffichage)) * 100;

    const conteneur = document.createElement("div");
    conteneur.className = "barre-propriete";
    conteneur.innerHTML = `
      <label>${nom} : ${valeur}</label>
      <div class="barre-externe">
        <div class="plage-ideale" style="left:${positionIdealMin}%; right:${100 - positionIdealMax}%"></div>
        <div class="valeur-barre" style="width:${pourcentage}%;"></div>
      </div>
    `;
    return conteneur;
  }

  function afficherProprietes(res) {
    const div = document.getElementById("proprietes-techniques");
    div.innerHTML = "";
    div.appendChild(genererBarrePropriete("INS", res.ins, 140, 155));
    div.appendChild(genererBarrePropriete("Iode", res.iode, 50, 65));
    div.appendChild(genererBarrePropriete("Dureté", res.durete, 35, 45));
    div.appendChild(genererBarrePropriete("Nettoyant", res.cleansing, 10, 18));
    div.appendChild(genererBarrePropriete("Conditionnant", res.conditioning, 50, 65));
    div.appendChild(genererBarrePropriete("Mousse (bulle)", res.bubbly, 20, 30));
    div.appendChild(genererBarrePropriete("Mousse (crémeuse)", res.creamy, 25, 35));
    div.innerHTML += `
      <p><strong>NaOH requis :</strong> ${res.masseNaOH} g</p>
      <p><strong>Eau recommandée :</strong> ${res.masseEau} g</p>
    `;
      // === Ajouts affichés (phase aqueuse uniquement) ===
      const lignesAjouts = document.querySelectorAll("#phase-aqueuse .ajout-item");
      let ajoutsUtilisés = [];

      lignesAjouts.forEach(ligne => {
          const select = ligne.querySelector("select");
          const input = ligne.querySelector("input");
          const nom = select?.value;
          const val = parseFloat(input?.value || 0);

          if (nom && !isNaN(val) && val > 0) {
              ajoutsUtilisés.push(`${nom} : ${val} g`);
          }
      });

      if (ajoutsUtilisés.length > 0) {
          const ajoutBloc = document.createElement("div");
          ajoutBloc.innerHTML = "<h3>Ajouts (phase aqueuse)</h3><ul>" +
              ajoutsUtilisés.map(a => `<li>${a}</li>`).join("") +
              "</ul>";
          div.appendChild(ajoutBloc);
      }

  }

  function afficherConformite(conf) {
    const div = document.getElementById("conformite");
    div.innerHTML = '<h3>Analyse de conformité Mother Tree</h3>';
    const ul = document.createElement("ul");
    for (const prop in conf) {
      const item = document.createElement("li");
      item.textContent = `${prop} : ${conf[prop].valeur}`;
      if (!conf[prop].conforme) {
        item.style.color = "red";
        item.title = conf[prop].message;
      } else {
        item.style.color = "green";
      }
      ul.appendChild(item);
    }
    div.appendChild(ul);
  }

  function afficherRatioDouceDure(data) {
    const div = document.getElementById("ratio-douce-dure");
    const total = data.reduce((acc, h) => acc + h.pourcentage, 0);
    const douce = data.filter(h => h.categorie === "douce").reduce((acc, h) => acc + h.pourcentage, 0);
    const dure = total - douce;

    div.innerHTML = `
      <h3>Ratio huiles douces vs. dures</h3>
      <p>Douces : ${douce.toFixed(1)}% / Dures : ${dure.toFixed(1)}%</p>
    `;
  }
    // === Ajouts dynamiques pour la phase aqueuse sous forme de menus déroulants ===

    function afficherAjoutsParPhase(phase, containerId) {
        const conteneur = document.getElementById(containerId);
        if (!conteneur) return;
        conteneur.innerHTML = "";

        const groupes = {};

        // Regroupement par type
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
                // Option vide pour placeholder visible
                const optionVide = document.createElement("option");
                optionVide.value = "";
                optionVide.textContent = "";
                select.appendChild(optionVide);

                // Ensuite les ajouts
                ajouts.forEach(a => {
                const option = document.createElement("option");
                option.value = a.nom;
                option.textContent = a.nom;
                select.appendChild(option);
                });
                const input = document.createElement("input");
                input.classList.add("menu-style");
                input.type = "number";
                input.min = 0;
                input.step = 0.1;
                input.placeholder = "g";

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
    // === Activation des onglets ===
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
    afficherAjoutsParPhase("aqueuse", "phase-aqueuse");
    afficherAjoutsParPhase("trace", "ajouts-trace");
    
});

