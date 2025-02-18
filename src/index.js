const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { createDownloadDirectories } = require('./utils/fileManager');

process.removeAllListeners('warning');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds],
    allowedMentions: { parse: [] }
});

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

client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    await loadAndRegisterCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorMessage = '❌ Une erreur est survenue lors de l\'exécution de la commande.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);