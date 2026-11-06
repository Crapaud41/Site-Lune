# Le Détour du Crapaud

Un niveau autonome en pixel art pour le site « Au fil des nuits ».

## Ouvrir le jeu

1. Dans le gestionnaire de projets Godot, cliquer sur **Importer**.
2. Choisir le fichier **project.godot** de ce dossier, puis **Importer et modifier**.
3. Appuyer sur **F5** dans Godot pour jouer.

## Commandes

- Flèches gauche et droite : avancer.
- Flèche du haut : sauter. Maintenir la touche permet un saut plus haut.
- Échap : pause / reprendre.
- Entrée : valider le bouton principal des écrans de menu.
- Les boutons se cliquent aussi avec la souris.

## Le parcours

Le bouton « Commencer » lance l'introduction de la fausse panne. Le crapaud avale ensuite la sortie et le niveau commence.

Les lucioles sont facultatives. Un putois touché de côté fait recommencer au début ou à la lanterne du milieu. Un putois écrasé rebondit et tombe hors de l'écran ; il reste éliminé lors des reprises de cette partie. Le bouton Rejouer remet tout le niveau à zéro.

Passer sous la banderole déclenche l'arrivée de Murphy. Le crapaud monte sur son dos et ils repartent ensemble, tournés vers la droite. À la fin, **Rejouer** relance le niveau et **Terminer la partie** ouvre la page Photos. Il n'y a plus de bouton de retour en haut de l'écran.

Sur le site, une partie terminée est mémorisée dans l'onglet : cliquer à nouveau sur la photo du crapaud l'ouvre normalement en grand, sans relancer le jeu. Les flèches de la visionneuse permettent aussi de la voir. Actualiser avec **F5** autorise une nouvelle partie. Le pont `web/photo-trigger.js` relie le jeu à la galerie. Le retour restaure l'album, la catégorie et la page. Sur téléphone et tablette, la photo s'ouvre directement, sans lancer le jeu prévu pour un clavier d'ordinateur. Dans Godot sur ordinateur, relancer avec F5 dans l'éditeur démarre aussi une nouvelle session.

## État de cette version

- Version pour ordinateur et export Web statique pour GitHub Pages.
- Personnages et décors originaux dessinés par code en pixels ; premières animations simples.
- Pas encore de son ni de musique.
- Les plateformes du haut sont des détours facultatifs pour les lucioles.
- La photo secrète est `photos/nature/animaux/02 Juillet 2026.jpg`.
- Exporter avec le profil Web fourni (Godot 4.7.2, Compatibility, sans threads). Les visiteurs n'ont pas besoin d'installer Godot.

## Hébergement Web

Le dossier publié `jeu-crapaud` contient le moteur Godot, les ressources du jeu et le pont vers Photos. `index.wasm.gz` est décompressé dans le navigateur par le shell HTML ; aucun serveur applicatif ni réglage spécial de GitHub Pages n'est requis. Le pack et le moteur sont identifiés par leur empreinte pour éviter de mélanger des versions en cache.

Le code source modifiable est fourni dans `source-godot.zip`. Les personnages, le décor et la police pixel sont dessinés par les scripts du projet. La licence du moteur Godot est jointe séparément.

Après un nouvel export dans `exports`, lancer `node web/package-web.cjs` avec Node.js pour préparer le dossier `web-build` à envoyer sur GitHub. Ne pas envoyer le fichier brut `index.wasm` : le script prépare sa version compressée et remplit les empreintes du shell. Il n'est pas nécessaire de relancer ce script pour jouer à la version déjà publiée.

## Vérifications

Le script `tests/gameplay_test.gd` vérifie les déplacements, le saut, les collisions, les lucioles, le point de reprise, la persistance des putois éliminés, la chute dans l'eau, la fin et le redémarrage de la partie.
