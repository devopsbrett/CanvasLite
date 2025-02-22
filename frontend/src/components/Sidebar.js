import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">CanvasLite</h2>
      <button className="create-btn">+ Create a Design</button>
      <ul>
        <li>🏠 Home</li>
        <li>📂 Projects</li>
        <li>📑 Templates</li>
        <li>⭐ Starred</li>
        <li>🗑️ Trash</li>
      </ul>
    </div>
  );
};

export default Sidebar;
