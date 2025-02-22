import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFolder, FaPalette, FaCog, FaPaintBrush, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.sidebar, width: collapsed ? "80px" : "250px" }}>
      {/* Sidebar Toggle Button */}
      <button onClick={() => setCollapsed(!collapsed)} style={styles.toggleButton}>
        <FaBars />
      </button>

      {/* Logo */}
      <div style={styles.logo}>
        <FaPaintBrush size={28} color="yellow" />
        {!collapsed && (
          <span style={styles.logoText}>
            {["C", "a", "n", "v", "a", "s", "L", "i", "t", "e"].map((letter, index) => (
              <span key={index} style={{ color: colors[index] }}>{letter}</span>
            ))}
          </span>
        )}
      </div>

      {/* Sidebar Menu */}
      <ul style={styles.list}>
        {menuItems.map((item, index) => (
          <li 
            key={index} 
            style={styles.item} 
            onClick={() => navigate(item.path)}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const colors = ["#FF5733", "#FF8D1A", "#FFC300", "#28A745", "#17A2B8", "#007BFF", "#6F42C1", "#E83E8C", "#6610F2", "#DC3545"];

const styles = {
  sidebar: {
    height: "100vh",
    width: "250px",  // Fixed width
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    color: "#000",
    padding: "20px",
    boxSizing: "border-box",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",  // Keeps sidebar fixed on the left
    left: 0,
    top: 0,
    bottom: 0,
    borderRight: "1px solid rgba(0, 0, 0, 0.1)",
    overflow: "hidden", // Prevents extra spacing issues
  },
  toggleButton: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "#333",
    border: "none",
    color: "white",
    fontSize: "18px",
    padding: "8px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 10,
    transition: "background 0.3s ease",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop: "50px",
    gap: "10px",
  },
  logoText: {
    display: "flex",
    gap: "2px",
    fontWeight: "bold",
    fontSize: "20px",
    fontFamily: "'Dancing Script', cursive",
    letterSpacing: "1px",
    textTransform: "capitalize",
  },
  list: {
    listStyle: "none",
    padding: 0,
    width: "100%",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background 0.3s",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
  },
};

const menuItems = [
  { icon: <FaHome />, label: "Home", path: "/" },
  { icon: <FaFolder />, label: "Projects", path: "/projects" },
  { icon: <FaPalette />, label: "Templates", path: "/templates" },
  { icon: <FaCog />, label: "Settings", path: "/settings" },
];

export default Sidebar;
