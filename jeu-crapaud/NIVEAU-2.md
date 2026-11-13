# La Lisière des lanternes

Deuxième niveau, construit à partir des commandes et de l'esprit du premier niveau. Le prototype du jardin est conservé à part dans le projet de travail local ; il n'est pas inclus dans la version Web.

## Jouer

Dans Godot, ouvrir `lantern.tscn` puis appuyer sur F6. Entrée démarre la promenade.

Depuis le niveau 1, le bouton **Suivant** mène à ce nouveau parcours, dans Godot comme dans la version Web.

- Gauche / droite pour marcher avec Murphy et le crapaud.
- Haut pour sauter. Garder la touche enfoncée pour les sauts longs.
- Espace pour attraper une luciole proche avec la langue.
- Échap pour mettre en pause et reprendre. Le jeu se met aussi en pause quand sa fenêtre perd le focus.
- Le code discret **1995** active ou désactive le vol. En vol, **Fin** conduit près de l'arrivée, puis rend les commandes normales.

## Parcours

Vingt lucioles facultatives jalonnent des berges, un ponton interrompu, des nénuphars et les piles d'un ancien pont. Une lanterne près du saule mémorise la reprise. Les putois se franchissent en sautant ou s'éliminent en leur retombant dessus. L'eau et le contact latéral avec un putois déclenchent une reprise. Les lucioles et les ennemis déjà éliminés restent mémorisés pendant cette partie.

La fin se déclenche en sautant dans la fenêtre ouverte de la maison, après une petite plateforme carrée suspendue. Une lumière chaude sort de la fenêtre et indique le dernier chemin. Il n'est pas nécessaire de tout ramasser pour finir. **Rejouer** remet le niveau à zéro. **Revenir aux photos** ouvre la galerie du site.

## Vérifications

`tests/lantern_check.gd` parcourt le niveau avec la physique réelle, sans vol ni téléportation, puis vérifie les reprises, les collisions, le code de vol, l'entrée et le menu final. `tests/lantern_transition_check.gd` vérifie le raccord depuis le niveau 1. `tests/lantern_preview.gd` produit cinq aperçus du rendu Godot.

Les images et personnages sont dessinés par le code du projet, sans téléchargement d'illustrations. Le niveau reste silencieux, comme le prototype initial.
