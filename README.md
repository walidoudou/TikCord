# 🤖 TikCord

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/walidoudou/TikCord)](https://github.com/walidoudou/TikCord/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/walidoudou/TikCord)](https://github.com/walidoudou/TikCord/issues)
[![GitHub forks](https://img.shields.io/github/forks/walidoudou/TikCord)](https://github.com/walidoudou/TikCord/network)

**TikCord est un bot Discord élégant qui transforme vos liens TikTok et Pinterest en contenu téléchargeable sans filigrane, optimisé pour une intégration parfaite dans vos serveurs.**

[Installation](#-installation) • 
[Fonctionnalités](#-fonctionnalités) • 
[Utilisation](#-utilisation) • 
[Configuration](#-configuration) • 
[Support](#-support)

</div>

## 🌟 Fonctionnalités

### TikTok
- 📥 Téléchargement instantané des vidéos sans filigrane
- 🎥 Support de la haute qualité (HD)
- 🔄 Conversion rapide et efficace

### Pinterest
- 🖼️ Support des images en haute qualité
- 🎬 Support des vidéos épinglées
- 📝 Conservation des métadonnées originales

### Général
- 📁 Organisation automatique des fichiers par plateforme
- 🧹 Nettoyage automatique après téléchargement
- ⚡ Temps de réponse optimisé
- 💾 Gestion intelligente du stockage temporaire

## 📦 Installation

1. **Clonez le projet**
```bash
git clone https://github.com/walidoudou/TikCord.git
cd TikCord
```

2. **Installez les dépendances**
```bash
npm install
```

3. **Configurez l'environnement**
```bash
cp .env.example .env
# Éditez le fichier .env avec vos informations
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
TOKEN=votre_token_discord_bot
RAPID_API_KEY=votre_cle_rapidapi
CLIENT_ID=le_client_id_de_votre_bot
```

## 🚀 Utilisation

### Commandes disponibles

| Commande | Description | Exemple |
|----------|-------------|---------|
| `/tiktok` | Télécharge une vidéo TikTok | `/tiktok lien:https://vm.tiktok.com/...` |
| `/pinterest` | Télécharge une image ou vidéo Pinterest | `/pinterest lien:https://pin.it/...` |

## 📂 Structure du Projet

```
TikCord/
├── src/
│   ├── commands/      # Commandes Discord
│   ├── utils/         # Utilitaires
│   └── index.js       # Point d'entrée
├── downloads/         # Dossier de téléchargement
│   ├── tiktok/       # Vidéos TikTok
│   └── pinterest/    # Médias Pinterest
└── ...
```

## ⚠️ Prérequis

- Node.js 16.9.0 ou supérieur
- Un compte Discord Developer
- Un compte RapidAPI avec abonnement aux APIs :
  - TikTok Video Downloader
  - Pinterest Video and Image Downloader

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez nos [guidelines de contribution](https://github.com/walidoudou/TikCord/CONTRIBUTING.md).

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/NouvelleFeature`)
3. Committez vos changements (`git commit -m 'Add: Nouvelle Feature'`)
4. Pushez vers la branche (`git push origin feature/NouvelleFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](https://github.com/walidoudou/TikCord/LICENSE) pour plus de détails.

## ✨ Crédit

Développé avec ❤️ par [walidoudou](https://github.com/walidoudou).

## 💬 Support

Une question ? Un problème ? N'hésitez pas à :
- Ouvrir une [issue](https://github.com/walidoudou/TikCord/issues)
- Rejoindre notre [serveur Discord](https://discord.gg/5Syw9ngqnz)
- Consulter la [documentation](https://github.com/walidoudou/TikCord/wiki)

---

<div align="center">
  
Fait avec ❤️ pour la communauté Discord.

**[⬆ Retour en haut](#-tikcord)**

</div>