const { SlashCommandBuilder } = require('discord.js');
const { downloadTikTokVideo } = require('../utils/download');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktok')
        .setDescription('Télécharge une vidéo TikTok.')
        .addStringOption(option =>
            option.setName('lien')
                .setDescription('Lien de la vidéo TikTok')
                .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('lien');

        if (!url.includes('tiktok.com')) {
            return interaction.reply({ 
                content: '❌ Lien invalide. Fournis un lien TikTok valide.', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            const { filePath } = await downloadTikTokVideo(url);

            const stats = fs.statSync(filePath);
            const fileSizeInMB = stats.size / (1024 * 1024);

            if (fileSizeInMB > 25) {
                fs.unlinkSync(filePath);
                return interaction.editReply('❌ La vidéo est trop grande (limite de 25 MB).');
            }

            const attachment = new AttachmentBuilder(filePath, { name: 'video.mp4' });

            await interaction.editReply({
                content: `✅ Voici votre vidéo TikTok !\n\nDemandé par ${interaction.user.tag}`,
                files: [attachment]
            });

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erreur commande TikTok:', error);
            await interaction.editReply(`❌ Erreur lors du téléchargement.\n\nDemandé par ${interaction.user.tag}`);
        }
    },
};
