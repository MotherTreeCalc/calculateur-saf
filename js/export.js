
// === EXPORT.JS ===
// Gère les exports CSV et PDF du calculateur SAF Mother Tree

/**
 * Génère un export CSV basé sur les résultats du calculateur
 */
document.getElementById("btn-export-csv").addEventListener("click", () => {
    const nomFichier = prompt("Nom du fichier CSV (sans extension) :", "recette_mother_tree");
    if (!nomFichier) return;

    const lignes = [];
    lignes.push("Élément, Valeur");

    const props = document.querySelectorAll("#proprietes-techniques .barre-propriete label, #proprietes-techniques p");
    props.forEach(el => {
        const [cle, val] = el.textContent.split(":");
        if (cle && val) {
            lignes.push(`"\${cle.trim()}","\${val.trim()}"`);
        }
    });

    const blob = new Blob([lignes.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `\${nomFichier}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

/**
 * Génère un PDF à partir des sections de résultats
 */
document.getElementById("btn-export-pdf").addEventListener("click", () => {
    const nomFichier = prompt("Nom du fichier PDF (sans extension) :", "recette_mother_tree");
    if (!nomFichier) return;

    import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        .then(({ jsPDF }) => {
            const doc = new jsPDF();
            let y = 10;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Recette SAF - Calculateur Mother Tree", 10, y);
            y += 10;

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");

            const props = document.querySelectorAll("#proprietes-techniques .barre-propriete label, #proprietes-techniques p");
            props.forEach(el => {
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
                doc.text(el.textContent, 10, y);
                y += 8;
            });

            doc.save(`\${nomFichier}.pdf`);
        })
        .catch(err => alert("Erreur lors du chargement de jsPDF : " + err));
});
