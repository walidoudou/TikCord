const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { downloadPinterestMedia } = require('../utils/download');
const fs = require('fs');
const axios = require('axios');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pinterest')
        .setDescription('Télécharge une image ou une vidéo Pinterest.')
        .addStringOption(option =>
            option.setName('lien')
                .setDescription('Lien Pinterest (pin.it ou pinterest.com)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('lien');

        // Validation améliorée pour accepter les liens courts pin.it et les liens complets
        if (!url.includes('pinterest.com') && !url.includes('pin.it')) {
            return interaction.reply({ 
                content: '❌ Lien invalide. Veuillez fournir un lien Pinterest valide (pin.it ou pinterest.com)', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            // Résolution du lien court si nécessaire
            const finalUrl = url.includes('pin.it') 
                ? await this.resolveShortUrl(url) 
                : url;

            const { filePath, mediaInfo } = await downloadPinterestMedia(finalUrl);
            const attachment = new AttachmentBuilder(filePath, { 
                name: `pinterest_media.${mediaInfo.type === 'video' ? 'mp4' : 'jpg'}` 
            });

            const replyMessage = `✅ Voici votre ${mediaInfo.type === 'video' ? 'vidéo' : 'image'} Pinterest!\n\nDemandé par ${interaction.user.tag}`;

            await interaction.editReply({
                content: replyMessage,
                files: [attachment]
            });

            fs.unlinkSync(filePath);

        } catch (error) {
            console.error('Erreur Pinterest:', error);
            await interaction.editReply(`❌ Erreur lors du téléchargement du média Pinterest.\n\nDemandé par ${interaction.user.tag}`);
        }
    },

    // Fonction pour résoudre les liens courts pin.it
    async resolveShortUrl(shortUrl) {
        try {
            const response = await axios.get(shortUrl, {
                maxRedirects: 5,
                validateStatus: status => status === 200
            });
            return response.request.res.responseUrl;
        } catch (error) {
            console.error('Erreur lors de la résolution du lien court:', error);
            throw new Error('Impossible de résoudre le lien Pinterest court');
        }
    }
};