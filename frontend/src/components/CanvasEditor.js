import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FaUndo, FaRedo, FaSave, FaImage, FaShapes, FaFont, FaTrash, FaFillDrip, FaPalette } from "react-icons/fa";
import "./CanvasEditor.css";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showShapeOptions, setShowShapeOptions] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#f8f9fa");

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js Canvas
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 600,
      backgroundColor: bgColor,
    });

    fabricCanvas.current.on("object:modified", saveState);
    fabricCanvas.current.on("object:removed", saveState);
    fabricCanvas.current.on("selection:created", handleSelection);
    fabricCanvas.current.on("selection:updated", handleSelection);

    return () => fabricCanvas.current.dispose();
  }, [bgColor]);

  const saveState = () => {
    setHistory((prev) => [...prev, JSON.stringify(fabricCanvas.current)]);
    setRedoStack([]);
  };

  const handleSelection = () => {
    const activeObj = fabricCanvas.current.getActiveObject();
    if (activeObj) {
      setSelectedColor(activeObj.fill || "#000000");
    }
  };

  // 📝 Add Editable Text
  const addText = () => {
    if (!fabricCanvas.current) return;
    const text = new fabric.IText("Edit Me", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: selectedColor,
      fontWeight: "bold",
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
    fabricCanvas.current.renderAll();
    saveState();
  };

  // 📂 Upload Image
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file && fabricCanvas.current) {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          img.scaleToWidth(200);
          fabricCanvas.current.add(img);
          fabricCanvas.current.renderAll();
          saveState();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // ↩️ Undo & Redo
  const undo = () => {
    if (history.length > 0) {
      const prevState = history.pop();
      setRedoStack([...redoStack, JSON.stringify(fabricCanvas.current)]);
      fabricCanvas.current.loadFromJSON(prevState, () => fabricCanvas.current.renderAll());
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setHistory([...history, JSON.stringify(fabricCanvas.current)]);
      fabricCanvas.current.loadFromJSON(nextState, () => fabricCanvas.current.renderAll());
    }
  };

  // ❌ Delete Selected Object
  const deleteObject = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      fabricCanvas.current.remove(activeObject);
      fabricCanvas.current.renderAll();
      saveState();
    }
  };

  // 🎨 Change Object Color
  const changeObjectColor = (color) => {
    setSelectedColor(color);
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      fabricCanvas.current.renderAll();
      saveState();
    }
  };

  // 🌆 Change Background Color
  const changeBgColor = (color) => {
    setBgColor(color);
    fabricCanvas.current.setBackgroundColor(color, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
  };

  // 📌 Toggle Shape Options
  const toggleShapeOptions = () => {
    setShowShapeOptions(!showShapeOptions);
  };

  // 🟦 Add Shape
  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case "Rectangle":
        shape = new fabric.Rect({ left: 150, top: 150, fill: selectedColor, width: 120, height: 80 });
        break;
      case "Circle":
        shape = new fabric.Circle({ left: 150, top: 150, fill: selectedColor, radius: 50 });
        break;
      case "Triangle":
        shape = new fabric.Triangle({ left: 150, top: 150, fill: selectedColor, width: 100, height: 100 });
        break;
      case "Line":
        shape = new fabric.Line([50, 100, 200, 100], { stroke: selectedColor, strokeWidth: 5 });
        break;
      case "Polygon":
        shape = new fabric.Polygon(
          [{ x: 200, y: 100 }, { x: 250, y: 150 }, { x: 225, y: 200 }, { x: 175, y: 200 }, { x: 150, y: 150 }],
          { fill: selectedColor }
        );
        break;
      default:
        return;
    }

    fabricCanvas.current.add(shape);
    fabricCanvas.current.setActiveObject(shape);
    fabricCanvas.current.renderAll();
    saveState();
    setShowShapeOptions(false);
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={addText}><FaFont /> Add Text</button>
        <button onClick={toggleShapeOptions}><FaShapes /> Add Shape</button>
        <input type="file" id="upload-image" accept="image/*" onChange={uploadImage} hidden />
        <button onClick={() => document.getElementById("upload-image").click()}><FaImage /> Upload</button>
        <button onClick={undo}><FaUndo /> Undo</button>
        <button onClick={redo}><FaRedo /> Redo</button>
        <button onClick={deleteObject}><FaTrash /> Delete</button>
        <button onClick={() => saveState()}><FaSave /> Save</button>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} id="canvas" />
      </div>

      {/* Shape Selection Panel */}
      {showShapeOptions && (
        <div className="shape-options">
          <svg onClick={() => addShape("Rectangle")} width="40" height="40"><rect width="40" height="30" fill={selectedColor} /></svg>
          <svg onClick={() => addShape("Circle")} width="40" height="40"><circle cx="20" cy="20" r="15" fill={selectedColor} /></svg>
          <svg onClick={() => addShape("Triangle")} width="40" height="40"><polygon points="20,5 5,35 35,35" fill={selectedColor} /></svg>
          <svg onClick={() => addShape("Line")} width="40" height="40"><line x1="5" y1="20" x2="35" y2="20" stroke={selectedColor} strokeWidth="4" /></svg>
        </div>
      )}

      {/* Color Pickers */}
      <div className="color-controls">
        <label>🎨 Object Color:</label>
        <input type="color" value={selectedColor} onChange={(e) => changeObjectColor(e.target.value)} />
        <label>🖼️ Background Color:</label>
        <input type="color" value={bgColor} onChange={(e) => changeBgColor(e.target.value)} />
      </div>
    </div>
  );
};

export default CanvasEditor;
