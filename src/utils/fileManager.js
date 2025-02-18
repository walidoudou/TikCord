const fs = require('fs');
const path = require('path');

const createDownloadDirectories = () => {
    const dirs = [
        'downloads/tiktok',
        'downloads/instagram_reels',
        'downloads/instagram_posts'
    ];

    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, '../../', dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
};

const getFilePath = (platform, type, fileName) => {
    const baseDir = path.join(__dirname, '../../downloads');
    const dirMap = {
        tiktok: 'tiktok',
        instagram_reel: 'instagram_reels',
        instagram_post: 'instagram_posts'
    };
    
    return path.join(baseDir, dirMap[platform], fileName);
};

module.exports = { createDownloadDirectories, getFilePath };