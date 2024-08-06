require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Configuration Multer pour gérer les fichiers uploadés //
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.array('images', 11), async (req, res) => {
    try {
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        result.original_filename = file.originalname;
                        resolve(result);
                    }
                });
                uploadStream.end(file.buffer);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        res.json({ message: 'Upload successful', results: uploadResults });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading images', error });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


