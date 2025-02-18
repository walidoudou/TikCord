const axios = require('axios');
const fs = require('fs');
const { getFilePath } = require('./fileManager');

const downloadTikTokVideo = async (url) => {
    try {
        const rapidApiResponse = await axios.get('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
            params: { url, hd: '1' },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
        });

        if (!rapidApiResponse.data?.data?.play) {
            throw new Error('URL de la vidéo non trouvée');
        }

        const videoUrl = rapidApiResponse.data.data.play;
        const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const fileName = `tiktok_${Date.now()}.mp4`;
        const filePath = getFilePath('tiktok', 'video', fileName);
        
        fs.writeFileSync(filePath, videoResponse.data);
        return { filePath, videoInfo: rapidApiResponse.data.data };
    } catch (error) {
        console.error('Erreur TikTok:', error.message);
        throw error;
    }
};

module.exports = { downloadTikTokVideo };