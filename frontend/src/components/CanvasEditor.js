import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FaUndo, FaRedo, FaSave, FaImage, FaShapes, FaFont, FaTrash, FaSquareFull, FaCircle, FaPlay } from "react-icons/fa";
import "./CanvasEditor.css";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 600 });
  const [showShapes, setShowShapes] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: bgColor,
    });

    fabricCanvas.current.on("object:modified", saveState);
    fabricCanvas.current.on("object:added", saveState);
    fabricCanvas.current.on("object:removed", saveState);
    return () => fabricCanvas.current.dispose();
  }, [canvasSize, bgColor]);

  const saveState = () => {
    const json = JSON.stringify(fabricCanvas.current.toJSON());
    setHistory((prev) => [...prev, json]);
    setRedoStack([]);
  };

  const addText = () => {
    const text = new fabric.IText("Edit Me", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: selectedColor,
      fontWeight: "bold",
    });
    fabricCanvas.current.add(text);
    saveState();
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          img.scaleToWidth(200);
          fabricCanvas.current.add(img);
          saveState();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    
    const prevState = history.pop();
    setRedoStack([...redoStack, JSON.stringify(fabricCanvas.current.toJSON())]);
    fabricCanvas.current.loadFromJSON(prevState, () => fabricCanvas.current.renderAll());
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack.pop();
    setHistory([...history, JSON.stringify(fabricCanvas.current.toJSON())]);
    fabricCanvas.current.loadFromJSON(nextState, () => fabricCanvas.current.renderAll());
  };

  const deleteObject = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      fabricCanvas.current.remove(activeObject);
      saveState();
    }
  };

  const changeObjectColor = (color) => {
    setSelectedColor(color);
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      fabricCanvas.current.renderAll();
      saveState();
    }
  };

  const changeBgColor = (color) => {
    setBgColor(color);
    fabricCanvas.current.setBackgroundColor(color, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
  };

  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case "Rectangle":
        shape = new fabric.Rect({
          left: 150,
          top: 150,
          width: 120,
          height: 80,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
        });
        break;
      case "Circle":
        shape = new fabric.Circle({
          left: 150,
          top: 150,
          radius: 50,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
        });
        break;
      case "Triangle":
        shape = new fabric.Triangle({
          left: 150,
          top: 150,
          width: 100,
          height: 100,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
        });
        break;
      default:
        return;
    }
    fabricCanvas.current.add(shape);
    saveState();
    setShowShapes(false);
  };

  const saveCanvas = () => {
    const dataURL = fabricCanvas.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={addText}><FaFont /> Text</button>

        <div className="shape-container">
          <button className="shape-button" onClick={() => setShowShapes(!showShapes)}>
            <FaShapes /> Shapes
          </button>
          {showShapes && (
            <div className="shape-dropdown">
              <button onClick={() => addShape("Rectangle")}><FaSquareFull /></button>
              <button onClick={() => addShape("Circle")}><FaCircle /></button>
              <button onClick={() => addShape("Triangle")}><FaPlay /></button>
            </div>
          )}
        </div>

        <input type="file" id="upload-image" accept="image/*" onChange={uploadImage} hidden />
        <button onClick={() => document.getElementById("upload-image").click()}><FaImage /> Image</button>
        <button onClick={undo}><FaUndo /> Undo</button>
        <button onClick={redo}><FaRedo /> Redo</button>
        <button onClick={deleteObject}><FaTrash /> Delete</button>
        <button onClick={saveCanvas}><FaSave /> Save</button>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} id="canvas" style={{ border: "1px solid #ccc" }} />
      </div>

      <div className="color-controls">
        <label>Object Color:</label>
        <input type="color" value={selectedColor} onChange={(e) => changeObjectColor(e.target.value)} />
        <label>Background:</label>
        <input type="color" value={bgColor} onChange={(e) => changeBgColor(e.target.value)} />
      </div>
    </div>
  );
};

export default CanvasEditor;
