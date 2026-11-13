# Salipro Hub – Tétouan (Code Source Séparé)

Structure du projet extrait :

- `index.html` : Page principale (coque de l'application)
- `css/style.css` : Feuille de style principale
- `js/app.js` : Logique principale (navigation, sauvegarde IndexedDB, gestion des rôles, export)
- `js/modules-bundle.js` : Registre des sous-modules embarqués (permet d'ouvrir `index.html` directement en local sans serveur HTTP)
- `modules/` : Code source séparé (HTML, CSS, JS) de chacun des 5 modules :
  - `modules/fuel/` : Suivi Gasoil
  - `modules/dep/` : Gestion des Déplacements
  - `modules/rec/` : Zone de réception / PDF & Excel
  - `modules/equip/` : Gestion de l'Équipe
  - `modules/perf/` : Suivi des Performances
