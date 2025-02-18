const path = require('path');
const fs = require('fs');

const createDownloadDirectories = () => {
    const dirs = [
        'downloads/pinterest/video',
        'downloads/pinterest/image',
        'downloads/tiktok/video'
    ];

    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, '../../', dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
};

const getFilePath = (platform, type, fileName) => {
    if (!platform || !type || !fileName) {
        console.error('Arguments manquants pour getFilePath:', { platform, type, fileName });
        return null;
    }

    const basePath = path.join(__dirname, '../../downloads', platform, type);
    
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    return path.join(basePath, fileName);
};

module.exports = { createDownloadDirectories, getFilePath };