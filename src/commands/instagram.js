const { SlashCommandBuilder } = require('discord.js');
const { downloadInstagramMedia } = require('../utils/download');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('instagram')
        .setDescription('Télécharge un post ou réel Instagram.')
        .addStringOption(option =>
            option.setName('lien')
                .setDescription('Lien Instagram')
                .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('lien');

        if (!url.includes('instagram.com')) {
            return interaction.reply({ 
                content: '❌ Lien invalide. Fournis un lien Instagram valide.', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            const type = url.includes('/reel/') ? 'reel' : 'post';
            const { filePath } = await downloadInstagramMedia(url, type);

            const stats = fs.statSync(filePath);
            const fileSizeInMB = stats.size / (1024 * 1024);

            if (fileSizeInMB > 25) {
                fs.unlinkSync(filePath);
                return interaction.editReply('❌ Le média est trop grand (limite de 25 MB).');
            }

            const attachment = new AttachmentBuilder(filePath, { name: 'media.mp4' });

            await interaction.editReply({
                content: `✅ Voici votre ${type === 'reel' ? 'réel' : 'post'} Instagram !\n\nDemandé par ${interaction.user.tag}`,
                files: [attachment]
            });

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erreur commande Instagram:', error);
            await interaction.editReply(`❌ Erreur lors du téléchargement.\n\nDemandé par ${interaction.user.tag}`);
        }
    },
};