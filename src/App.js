import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../src/components/Navbar/index.jsx';
import './App.css';

function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadResult, setUploadResult] = useState(null);
    const [images, setImages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const fileInputRef = React.createRef();

    // Fonction pour récupérer les images depuis Cloudinary //
    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:3001/images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Fonction pour uploader les images vers Cloudinary //
    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }

        try {
            //
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadResult(response.data);
            setSelectedFiles([]);  // Réinitialise l'état pour vider l'input file //
            event.target.reset();  // Réinitialise le formulaire //
            fileInputRef.current.value = "";

            // Réactualise la liste des images après l'upload //
            fetchImages();
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    // Fonction pour ouvrir la modale //
    const showModal = (message) => {
        setModalMessage(message);
        setIsModalVisible(true);
    };

    // Fonction pour fermer la modale //
    const closeModal = () => {
        setIsModalVisible(false);
    };

    // Fonction pour supprimer une image //
    const handleDelete = async (publicId) => {
        try {
            // Envoi une requête DELETE au serveur local qui gère la suppression de l'image sur Cloudinary //
            const response = await axios.delete(`http://localhost:3001/images/${publicId}`);
            // Vérifie si la suppression a réussi //
            if (response.status === 200) {
                fetchImages(); // Réactualise la liste des images après la suppression //
                showModal('Image deleted successfully.')
            } else {
                console.error('Failed to delete image:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting image:', error.response ? error.response.data : error.message)
        }
    };
    

    return (
        <div className="container-form">
            <h1 id="upload-section" className="title-form">Upload Images to Cloudinary</h1>
            <form onSubmit={handleUpload}>
                <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
                <button type="submit">Upload</button>
            </form>
            {uploadResult && (
            <div className="container-result">
                <h2 id="result-section" className="result">Last Upload Result</h2>
                <ul className="list">
                    {uploadResult.results.map((result, index) => (
                        <li className="element-list" key={index}>
                            <img src={result.secure_url} alt={result.public_id} width="30" />
                            <p className="name">Name: {result.original_filename}</p>
                            <p className="url">Cloudinary URL: <a className="link" href={result.secure_url} target="_blank" rel="noopener noreferrer">{result.secure_url}</a></p>
                        </li>
                    ))}
                </ul>
            </div>
            )}
            <div className="container-images">
                <h2 id="getall-section">Uploaded Images List</h2>
                <ul className="images-list">
                    {images.map((image, index) => (
                        <li className="image-item" key={index}>
                            <img src={image.secure_url} alt={image.public_id} width="30" />
                            <p className="name">Name: {image.public_id}</p>
                            <p className="url">Url: {image.url}</p>
                            <button onClick={() => handleDelete(image.public_id)}>Delete</button> 
                        </li>
                    ))}
                </ul>
            </div>
            <Navbar />
            {/* Modale pour afficher le message de succès */}
            {isModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <p>{modalMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
