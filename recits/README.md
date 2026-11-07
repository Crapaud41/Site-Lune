# Les petits récits des photos

Chaque fichier `.txt` de ce dossier crée une fiche, avec un simple **?** sur la photo correspondante.

## Ajouter une fiche

1. Dupliquer `lucane-cerf-volant.txt` et choisir un autre nom, par exemple `coquelicot.txt`.
2. Changer la ligne **Photo** : copier le chemin et le nom exact du fichier photo, sans changer sa date. Exemple : `photos/nature/fleurs/02 Juin 2024.jpg`.
3. Remplacer les informations et le texte, puis envoyer le fichier dans ce dossier sur GitHub.
4. Attendre le déploiement et actualiser la page Photos.

Le site repère automatiquement les fichiers `.txt` présents directement dans ce dossier. Aucun autre fichier de code n'est à modifier. Le dossier s'appelle `recits` : Windows n'accepte pas `?` dans un nom de dossier.

## Modèle à copier

```text
Photo : photos/nature/animaux/nom exact de la photo.jpg
Titre : Nom de l’animal ou de la fleur
Nom scientifique : Nom latin
Famille : Sa famille
Ordre : Son ordre
Milieu : Où on peut le rencontrer

Texte :
Un premier paragraphe court pour présenter l’espèce.

Une particularité intéressante ou une observation personnelle.

Source : Nom du site | https://adresse-de-la-source.fr/fiche
```

Garder une fiche courte (environ 60 à 100 mots) pour une lecture confortable sur téléphone. Les lignes Nom scientifique, Famille, Ordre, Milieu et Source peuvent être omises si elles ne sont pas utiles. Éviter une identification précise si elle n'est pas certaine.

Pour relier la même fiche à plusieurs clichés, ajouter plusieurs lignes `Photo :` au début. Les noms des photos et les accents doivent correspondre aux fichiers existants. Laisser les champs avant `Texte :` et les sources après les paragraphes. Une ligne commençant par `#` est un commentaire.

`photos/descriptions.txt` continue à gérer les titres sous les photos. Les fichiers de ce dossier servent uniquement aux fiches de découverte.
