const { Client, GatewayIntentBits, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function downloadTikTokVideo(url) {
    try {
        const rapidApiResponse = await axios.get('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
            params: {
                url: url,
                hd: '1'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
        });

        if (!rapidApiResponse.data || !rapidApiResponse.data.data || !rapidApiResponse.data.data.play) {
            throw new Error('URL de la vidéo non trouvée dans la réponse de l\'API');
        }

        const videoUrl = rapidApiResponse.data.data.play;
        const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const fileName = `tiktok_${Date.now()}.mp4`;
        const filePath = path.join(__dirname, 'temp', fileName);

        if (!fs.existsSync(path.join(__dirname, 'temp'))) {
            fs.mkdirSync(path.join(__dirname, 'temp'));
        }

        fs.writeFileSync(filePath, videoResponse.data);

        return {
            filePath,
            videoInfo: rapidApiResponse.data.data
        };
    } catch (error) {
        console.error('Erreur détaillée:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        throw error;
    }
}

client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'tiktok') {
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
                return interaction.editReply('❌ La vidéo est trop grande pour être envoyée sur Discord (limite de 25 MB).');
            }

            const attachment = new AttachmentBuilder(filePath, { name: 'tiktok_video.mp4' });

            await interaction.editReply({
                content: `✅ Voici votre vidéo TikTok !\n\nDemandé par ${interaction.user.tag}`,
                files: [attachment]
            });

            fs.unlinkSync(filePath);

        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            await interaction.editReply(`❌ Erreur lors du téléchargement de la vidéo.\n\nDemandé par ${interaction.user.tag}`);
        }
    }
});

client.on('ready', async () => {
    const commands = [
        new SlashCommandBuilder()
            .setName('tiktok')
            .setDescription('Télécharge une vidéo TikTok.')
            .addStringOption(option =>
                option.setName('lien')
                    .setDescription('Lien de la vidéo TikTok')
                    .setRequired(true)
            )
    ].map(command => command.toJSON());

    await client.application.commands.set(commands);
    console.log('✅ Commandes enregistrées.');
});

client.login(process.env.TOKEN);