import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';

const VerticalNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("upload");

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    const handleNavigation = (sectionId, tabName) => {
        setActiveTab(tabName);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container-nav">
            <div 
                className={`vertical-navbar ${isOpen ? 'open' : 'closed'}`} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >
                <button 
                    className={`navbar-btn ${activeTab === "upload" ? "active" : ""}`} 
                    onClick={() => handleNavigation("upload-section", "upload")}
                >
                    Upload
                </button>
                <button 
                    className={`navbar-btn ${activeTab === "result" ? "active" : ""}`} 
                    onClick={() => handleNavigation("result-section", "result")}
                >
                    Result
                </button>
                <button 
                    className={`navbar-btn ${activeTab === "getAll" ? "active" : ""}`} 
                    onClick={() => handleNavigation("getall-section", "getAll")}
                >
                    Get All
                </button>
                <button 
                    className={`navbar-btn ${activeTab === "delete" ? "active" : ""}`} 
                    onClick={() => handleNavigation("getall-section", "delete")}
                >
                    Delete
                </button>
            </div>

            <div 
                className="menu-icon" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >
                <FontAwesomeIcon icon={faBars} />
            </div>

            {/* Contenu principal en fonction du bouton actif */}
            <div className="content">
                {activeTab === "upload"}
                {activeTab === "getAll"}
                {activeTab === "delete"}
            </div>
        </div>
    );
};

export default VerticalNavbar;
