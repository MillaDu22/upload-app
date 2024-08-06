import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadResult, setUploadResult] = useState(null);
    const fileInputRef = React.createRef();

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
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadResult(response.data);
            setSelectedFiles([]);  // Réinitialise l'état pour vider l'input file //
            event.target.reset();  // Réinitialise le formulaire //
            fileInputRef.current.value = "";
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    return (
        <div className="container-form">
            <h1 className = "title-form">Upload Images to Cloudinary</h1>
            <form onSubmit={handleUpload}>
                <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
                <button type="submit">Upload</button>
            </form>
            {uploadResult && (
            <div className ="container-result">
                <h2 className="result">Upload Result</h2>
                <ul className="list" >
                    {uploadResult.results.map((result, index) => (
                        <li className="element-list" key={index}>
                            <p className ="name">Name: {result.original_filename}</p>
                            <p className ="url">Cloudinary URL: <a className="link" href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        </div>
    );
}

export default App;
