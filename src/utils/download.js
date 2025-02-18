const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ensureDownloadDirectory = (platform, type) => {
    const downloadPath = path.join(__dirname, '../../downloads', platform, type);
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
    }
    return downloadPath;
};

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

        const videoData = rapidApiResponse.data.data;
        const videoUrl = videoData.play;
        
        const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const downloadDir = ensureDownloadDirectory('tiktok', 'video');
        const fileName = `tiktok_${Date.now()}.mp4`;
        const filePath = path.join(downloadDir, fileName);
        
        fs.writeFileSync(filePath, videoResponse.data);
        
        return { 
            filePath, 
            mediaInfo: {
                type: 'video',
                title: videoData.title || 'TikTok Video',
                author: videoData.author || 'Unknown',
                duration: videoData.duration,
                likes: videoData.digg_count,
                shares: videoData.share_count,
                originalUrl: url,
                downloadTime: new Date().toISOString()
            }
        };
    } catch (error) {
        throw new Error(`Erreur lors du téléchargement TikTok: ${error.message}`);
    }
};

const downloadPinterestMedia = async (url) => {
    try {
        const cleanUrl = url.split('?')[0];
        
        const options = {
            method: 'GET',
            url: 'https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest',
            params: { url: cleanUrl },
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
            }
        };

        const rapidApiResponse = await axios.request(options);

        if (!rapidApiResponse.data?.success || !rapidApiResponse.data?.data?.url) {
            throw new Error('Média Pinterest non trouvé');
        }

        const { data: mediaData, type } = rapidApiResponse.data;
        const mediaUrl = mediaData.url;
        const isVideo = type === 'video';
        const mediaType = isVideo ? 'video' : 'image';

        const mediaResponse = await axios.get(mediaUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const downloadDir = ensureDownloadDirectory('pinterest', mediaType);
        const extension = isVideo ? 'mp4' : 'jpg';
        const fileName = `pinterest_${Date.now()}.${extension}`;
        const filePath = path.join(downloadDir, fileName);
        
        fs.writeFileSync(filePath, mediaResponse.data);
        
        return { 
            filePath, 
            mediaInfo: {
                type: mediaType,
                title: mediaData.title || 'Pinterest Media',
                width: mediaData.width,
                height: mediaData.height,
                duration: mediaData.duration,
                thumbnail: mediaData.thumbnail,
                originalUrl: cleanUrl,
                downloadTime: new Date().toISOString()
            }
        };
    } catch (error) {
        throw new Error(`Erreur lors du téléchargement Pinterest: ${error.message}`);
    }
};

module.exports = {
    downloadTikTokVideo,
    downloadPinterestMedia
};