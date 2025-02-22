import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CanvasEditor from "./components/CanvasEditor";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /> 
        <div 
          style={{ 
            flex: 1, 
            transition: "margin-left 0.3s ease", 
            marginLeft: collapsed ? "80px" : "250px",  // Adjust based on sidebar state
            padding: "20px" 
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<CanvasEditor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
