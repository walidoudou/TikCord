const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot et des APIs'),

    async execute(interaction) {
        await interaction.deferReply();

        const startTime = Date.now();
        let apiResults = [];

        // Test TikTok API
        try {
            const tiktokStart = Date.now();
            await axios.get('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                    'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
                }
            });
            const tiktokPing = Date.now() - tiktokStart;
            apiResults.push({ name: 'TikTok API', ping: tiktokPing });
        } catch (error) {
            apiResults.push({ name: 'TikTok API', error: true });
        }

        // Test Pinterest API
        try {
            const pinterestStart = Date.now();
            await axios.get('https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest', {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                    'X-RapidAPI-Host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
                }
            });
            const pinterestPing = Date.now() - pinterestStart;
            apiResults.push({ name: 'Pinterest API', ping: pinterestPing });
        } catch (error) {
            apiResults.push({ name: 'Pinterest API', error: true });
        }

        const botPing = Date.now() - startTime;

        const embed = new EmbedBuilder()
            .setColor('#FF0050')
            .setTitle('🏓 Pong!')
            .addFields([
                { name: '🤖 Bot Latency', value: `${botPing}ms`, inline: true },
                ...apiResults.map(api => ({
                    name: `📡 ${api.name}`,
                    value: api.error ? '❌ Error' : `${api.ping}ms`,
                    inline: true
                }))
            ])
            .setTimestamp()
            .setFooter({ 
                text: `Demandé par ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.editReply({ embeds: [embed] });
    },
};