// === Activation des onglets (version mobile) ===
document.addEventListener("DOMContentLoaded", () => {
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
