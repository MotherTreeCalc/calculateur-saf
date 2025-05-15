
window.calculerProprietes = function (data, poidsTotal, surgras, ratioEau) {
    let sapMoyen = 0;
    let masseNaOH = 0;
    let masseEau = 0;

    const props = {
        ins: 0,
        iode: 0,
        laurique: 0, myristique: 0, palmitique: 0, stearique: 0,
        ricinoleique: 0, oleique: 0, linoleique: 0, linolenique: 0
    };

    let totalPourcentage = 0;

    data.forEach(h => {
        if (!h || !h.pourcentage || h.pourcentage <= 0) return;

        const f = h.pourcentage / 100;
        totalPourcentage += h.pourcentage;

        if (h.sapNaoh) sapMoyen += h.sapNaoh * f;

        props.ins += (h.ins || 0) * f;
        props.iode += (h.iode || 0) * f;

        props.laurique += (h.laurique || 0) * f;
        props.myristique += (h.myristique || 0) * f;
        props.palmitique += (h.palmitique || 0) * f;
        props.stearique += (h.stearique || 0) * f;
        props.ricinoleique += (h.ricinoleique || 0) * f;
        props.oleique += (h.oleique || 0) * f;
        props.linoleique += (h.linoleique || 0) * f;
        props.linolenique += (h.linolenique || 0) * f;
    });

    masseNaOH = poidsTotal * sapMoyen * (1 - surgras / 100);
    masseEau = poidsTotal * ratioEau;

    const result = {
        sapMoyen: round(sapMoyen, 4),
        masseNaOH: round(masseNaOH, 2),
        masseEau: round(masseEau, 2),
        ins: round(props.ins, 1),
        iode: round(props.iode, 1),

        durete: round(props.laurique + props.myristique + props.palmitique + props.stearique, 1),
        cleansing: round(props.laurique + props.myristique, 1),
        conditioning: round(props.oleique + props.linoleique + props.linolenique, 1),
        bubbly: round(props.laurique + props.myristique + props.ricinoleique, 1),
        creamy: round(props.palmitique + props.stearique + props.ricinoleique, 1),

        saturated: round(props.laurique + props.myristique + props.palmitique + props.stearique, 1),
        monoUnsat: round(props.oleique + props.ricinoleique, 1),
        polyUnsat: round(props.linoleique + props.linolenique, 1),

        laurique: round(props.laurique, 1),
        myristique: round(props.myristique, 1),
        palmitique: round(props.palmitique, 1),
        stearique: round(props.stearique, 1),
        ricinoleique: round(props.ricinoleique, 1),
        oleique: round(props.oleique, 1),
        linoleique: round(props.linoleique, 1),
        linolenique: round(props.linolenique, 1)
    };

    return result;
};

function round(val, decimals) {
    return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
/**
 * Analyse la conformité d'un résultat technique selon les plages Mother Tree.
 * @param {Object} resultats - Lobjet retourné par calculerProprietes()
 * @returns {Object} Un objet de validation avec conformité booléenne et messages si écart
 */
window.analyserConformite = function (resultats) {
    const plages = {
        ins: [140, 155],
        iode: [50, 65],
        durete: [35, 45],
        cleansing: [10, 18],
        conditioning: [50, 65],
        bubbly: [20, 30],
        creamy: [25, 35]
    };

    const analyse = {};

    for (const prop in plages) {
        const [min, max] = plages[prop];
        const valeur = resultats[prop];
        const conforme = valeur >= min && valeur <= max;
        let message = "";

        if (!conforme) {
            if (valeur < min) {
                message = `Trop bas (min ${min})`;
            } else if (valeur > max) {
                message = `Trop élevé (max ${max})`;
            }
        }

        analyse[prop] = {
            conforme,
            valeur: round(valeur, 1),
            ...(message && { message })
        };
    }

    return analyse;
};
