import React from "react";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>Welcome to CanvasLite</h1>
        <p>Start designing your graphics here!</p>
      </div>
    </div>
  );
}

export default App;
