import React, { useState } from "react";
import { FaHome, FaFolder, FaPalette, FaCog, FaPaintBrush, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

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
          <li key={index} style={styles.item}>
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
    backgroundColor: "#007bff",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    gap: "10px",
  },
  logoText: {
    display: "flex",
    gap: "2px",
    fontWeight: "bold",
    fontSize: "24px",
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
  },
};

const menuItems = [
  { icon: <FaHome />, label: "Home" },
  { icon: <FaFolder />, label: "Projects" },
  { icon: <FaPalette />, label: "Templates" },
  { icon: <FaCog />, label: "Settings" },
];

export default Sidebar;
