# Guide de Contribution

Nous sommes ravis que vous souhaitiez contribuer à TikCord ! Ce document vous guidera à travers le processus de contribution pour assurer une collaboration efficace.

## Code de Conduite

En participant à ce projet, vous vous engagez à maintenir un environnement respectueux et professionnel. Nous attendons de tous les contributeurs qu'ils :

- Utilisent un langage accueillant et inclusif
- Respectent les différents points de vue et expériences
- Acceptent gracieusement les critiques constructives
- Se concentrent sur ce qui est le mieux pour la communauté
- Fassent preuve d'empathie envers les autres membres

## Comment Contribuer

### Signalement de Bugs

Si vous trouvez un bug, veuillez créer une issue en utilisant le modèle de bug report. Assurez-vous d'inclure :

1. Une description claire du bug
2. Les étapes pour reproduire le problème
3. Le comportement attendu
4. Le comportement actuel
5. Des captures d'écran si applicable
6. Votre environnement (OS, version de Node.js, etc.)

### Suggestion de Fonctionnalités

Nous accueillons favorablement les suggestions pour améliorer TikCord. Pour proposer une nouvelle fonctionnalité :

1. Vérifiez d'abord que votre idée n'a pas déjà été suggérée
2. Créez une nouvelle issue en utilisant le modèle de feature request
3. Expliquez clairement la fonctionnalité et ses avantages
4. Attendez les retours de la communauté et des mainteneurs

### Processus de Pull Request

1. Forkez le dépôt
2. Créez une nouvelle branche depuis `main`
   ```bash
   git checkout -b feature/nom-de-votre-fonctionnalité
   ```
3. Effectuez vos modifications
4. Suivez les conventions de code
5. Testez vos modifications
6. Committez vos changements
   ```bash
   git commit -m "Description claire des modifications"
   ```
7. Poussez vers votre fork
   ```bash
   git push origin feature/nom-de-votre-fonctionnalité
   ```
8. Ouvrez une Pull Request

### Conventions de Code

- Utilisez des noms de variables et fonctions descriptifs
- Commentez votre code quand nécessaire
- Suivez les conventions ESLint du projet
- Testez votre code avant de soumettre
- Gardez les commits atomiques et les messages clairs

### Style de Code

```javascript
// Exemple de style de code à suivre
async function maFonction(parametre) {
    try {
        const resultat = await uneOperation();
        return resultat;
    } catch (error) {
        console.error('Message d\'erreur descriptif:', error);
        throw error;
    }
}
```

## Processus de Revue

1. Au moins un mainteneur doit approuver votre PR
2. Les tests automatisés doivent passer
3. Le code doit suivre les conventions du projet
4. La documentation doit être mise à jour si nécessaire

## Questions

Si vous avez des questions :

1. Consultez d'abord la documentation existante
2. Vérifiez les issues existantes
3. Rejoignez notre serveur Discord
4. Ouvrez une nouvelle issue avec le tag "question"

## Reconnaissance

Les contributeurs sont listés dans le fichier README.md. Votre contribution sera reconnue !

---

Merci de contribuer à TikCord ! Votre aide est précieuse pour améliorer ce projet.