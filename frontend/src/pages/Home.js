import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { FaPlus, FaCrown, FaHome, FaFolder, FaPalette, FaStore, FaShapes } from "react-icons/fa";
import "../pages/Home.css";

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="homepage">
      <div className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Unleash Your Creativity with CanvasLite</h1>
          <p>Design stunning visuals effortlessly.</p>
          
          {/* Navigate to /editor on click */}
          <button className="create-btn" onClick={() => navigate("/editor")}>
            <FaPlus /> Create a Design
          </button>
        </div>

        {/* Categories */}
        <div className="categories">
          <div className="category"><FaShapes /> Logos</div>
          <div className="category"><FaPalette /> Social Media</div>
          <div className="category"><FaStore /> Business Cards</div>
        </div>

        {/* Recent Designs */}
        <div className="recent-designs">
          <h2>Recent Designs</h2>
          <div className="designs-grid">
            <div className="design-card"></div>
            <div className="design-card"></div>
            <div className="design-card"></div>
            <div className="design-card"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
