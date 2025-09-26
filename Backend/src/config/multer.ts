import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'uploads/images',
            format: file.mimetype.split('/')[1],
            resource_type: 'image', 
        }
    }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => { 
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedImageTypes.includes(file.mimetype)) { 
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 
    }
})

export default upload;
