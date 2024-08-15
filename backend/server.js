require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const axios = require ('axios');

const app = express();
const port = process.env.PORT || 3001;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    url: process.env.CLOUDINARY_URL,
    secure: true
});

// Configuration Multer pour gérer les fichiers uploadés //
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors({
    origin: '*', // Permet toutes les origines pour tester //
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.post('/upload', upload.array('images', 11), async (req, res) => {
    try {
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) {
                        console.log(error)
                        reject(error);
                    } else {
                        result.id = file.public_id;
                        result.original_filename = file.originalname;
                        result.url = file.url;
                        resolve(result);
                    }
                });
                uploadStream.end(file.buffer);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        console.log(uploadResults);
        res.json({ message: 'Upload successful', results: uploadResults });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading images', error });
        console.log (res)
    }
});

app.get('/images', async (req, res) => {
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = `https://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`;
    try {
        const response = await axios.get(cloudinaryUrl, {
            auth: {
                username: apiKey,
                password: apiSecret,
            },
            params: {
                max_results: 150, // Nombre maximum d'images à récupérer//
            },
        });

        // Accés aux assets dans la réponse //
        const assets = response.data.resources;
        res.json(assets);

    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Nouvelle route pour supprimer une image //
app.delete('/images/:publicId', async (req, res) => {
    const { publicId } = req.params;
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok') {
            return res.status(500).json({ message: 'Failed to delete image from Cloudinary', result });
        }
        res.json({ message: `Image with public ID ${publicId} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image', error });
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

