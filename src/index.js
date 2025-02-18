const { 
    Client, 
    Collection, 
    GatewayIntentBits, 
    REST, 
    Routes,
    Partials
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { createDownloadDirectories } = require('./utils/fileManager');

// Suppression des avertissements non pertinents
process.removeAllListeners('warning');

// Configuration du client avec les intents et partials nécessaires
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMessageTyping
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
    ],
    allowedMentions: { parse: [] }
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Création des dossiers de téléchargement
createDownloadDirectories();

// Chargement et enregistrement des commandes
async function loadAndRegisterCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        // Ajoute la commande à la collection du client
        client.commands.set(command.data.name, command);
        
        // Ajoute la commande à la liste pour l'enregistrement
        commands.push(command.data.toJSON());
    }

    // Enregistrement des commandes auprès de Discord
    const rest = new REST().setToken(process.env.TOKEN);

    try {
        console.log('🔄 Début du déploiement des commandes...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('✅ Commandes enregistrées avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement des commandes:', error);
    }
}

// Gestion des événements du client
client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    await loadAndRegisterCommands();
});

// Gestionnaire d'interaction amélioré
client.on('interactionCreate', async interaction => {
    // Ignore les interactions non-commandes
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        // Vérification des permissions dans les serveurs
        if (interaction.guild) {
            const permissions = interaction.channel.permissionsFor(client.user);
            if (!permissions.has('SendMessages') || !permissions.has('AttachFiles')) {
                return interaction.reply({ 
                    content: '❌ Je n\'ai pas les permissions nécessaires dans ce canal. J\'ai besoin des permissions d\'envoi de messages et de fichiers.',
                    ephemeral: true 
                });
            }
        }

        await command.execute(interaction);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
        const errorMessage = '❌ Une erreur est survenue lors de l\'exécution de la commande.';
        
        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        } catch (followUpError) {
            console.error('Erreur lors de l\'envoi du message d\'erreur:', followUpError);
        }
    }
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', error => {
    console.error('Erreur non gérée:', error);
});

// Connexion du client
client.login(process.env.TOKEN);