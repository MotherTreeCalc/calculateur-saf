# Calculateur SAF – Mother Tree

Ce projet est un calculateur professionnel pour la formulation de savons saponifiés à froid (SAF), conçu avec rigueur artisanale pour la marque Mother Tree.

---

## 🌿 Objectif

Fournir un outil web complet, précis et accessible permettant de :

* Calculer les propriétés techniques d’un savon (INS, Iode, Dureté, etc.)
* Équilibrer les huiles douces et dures
* Vérifier la conformité aux plages Mother Tree
* Exporter les résultats en PDF et CSV

---

## 📊 Architecture du projet

```
calculateur-saf/
├── index.html                  ← structure HTML sémantique principale
├── css/
│   └── style.css               ← thème artisanal, responsive, dark-mode natif
├── js/
│   ├── main.js                 ← logique DOM, affichage dynamique, calculs
│   ├── data_huiles.js          ← base d'huiles (132 entrées validées)
│   ├── calculs.js              ← fonctions mathématiques SoapCalc
│   ├── export.js               ← export CSV / PDF avec nom personnalisé
│   └── helpers.js              ← outils utilitaires et accessibilité
├── assets/
│   └── img/                    ← icônes, logos, textures artisanales (non inclus)
├── data/
│   └── exemples.json           ← recettes préremplies (placeholder)
├── favicon.ico
└── README.md                  ← documentation projet
```

---

## ✅ Fonctionnalités principales

* 🏠 Interface web sémantique HTML5 avec champs dynamiques
* ✏️ 10 huiles maximum, choix et pourcentage personnalisables
* 🤝 Calcul en temps réel des propriétés et conformités
* 🌿 Ratio doux/dur affiché en temps réel
* ❌ Gestion des erreurs (total %, champs vides, etc.)
* 🔄 Bouton de réinitialisation complet
* 🖇️ Export CSV et PDF avec nom personnalisable
* 🚼 Accessible (ARIA, navigation clavier)
* 💡 Responsive + dark mode automatique

---

## 🚀 Lancer le projet localement

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-utilisateur/calculateur-saf.git
```

2. Ouvrir `index.html` dans un navigateur moderne

Aucune dépendance externe requise sauf :

* `jsPDF` chargé dynamiquement pour l’export PDF

---

## 📅 Statut

Version stable fonctionnelle. Huiles validées : 132. Calculs conformes au standard SoapCalc.

Des améliorations futures possibles :

* Mode multi-recette ou sauvegarde locale
* Chargement automatique de profils d’huile préconfigurés
* Graphiques SVG ou jauges pour visualisation des plages

---

## 🌺 Crédit

Conçu artisanalement pour le projet Mother Tree par un développeur front-end spécialisé en accessibilité, formulation naturelle et design épuré.

> "Un savon bien formulé est un poème tactile au service du vivant."
