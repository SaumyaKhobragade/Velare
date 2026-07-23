import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudinaryConfig = cloudinary.v2;
cloudinaryConfig.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinaryConfig,
    params: {
        folder: 'Velare',
        allowedFormats: ['jpeg', 'png', 'jpg']
    },
});

export { cloudinaryConfig, cloudinaryStorage };