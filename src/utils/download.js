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

const downloadInstagramMedia = async (url, type) => {
    try {
        const rapidApiResponse = await axios.get('https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index', {
            params: { url },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
            }
        });

        if (!rapidApiResponse.data?.media) {
            throw new Error('Média Instagram non trouvé');
        }

        const mediaUrl = rapidApiResponse.data.media;
        const mediaResponse = await axios.get(mediaUrl, {
            responseType: 'arraybuffer'
        });

        const fileName = `instagram_${type}_${Date.now()}.mp4`;
        const filePath = getFilePath(`instagram_${type}`, 'video', fileName);
        
        fs.writeFileSync(filePath, mediaResponse.data);
        return { filePath, mediaInfo: rapidApiResponse.data };
    } catch (error) {
        console.error('Erreur Instagram:', error.message);
        throw error;
    }
};

module.exports = { downloadTikTokVideo, downloadInstagramMedia };