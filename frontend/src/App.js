import React from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Home />
    </div>
  );
}

export default App;
