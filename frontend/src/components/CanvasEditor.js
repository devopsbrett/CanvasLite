// CanvasEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FaUndo, FaRedo, FaSave, FaImage, FaShapes, FaFont, FaTrash, FaSquareFull, FaCircle, FaPlay, FaSmile } from "react-icons/fa";
import "./CanvasEditor.css";

const stickers = [
  // Emoji Sets
  // Animals
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
  "🦁", "🐮", "🐷", "🐸", "🐵", "🦄", "🐝", "🦋", "🐌", "🐞",
  // Nature & Weather
  "🌺", "🌸", "🌼", "🌻", "🌹", "🌴", "🌲", "🌳", "⭐", "🌟",
  "✨", "💫", "☀", "🌤", "🌈", "🌙", "⚡", "❄", "🌊", "🍀",
  // Fun & Celebration
  "🎈", "🎉", "🎊", "🎂", "🎁", "🎭", "🎪", "🎨", "🎯", "🎲","⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸", "🥌", "🎿", "⛷", "🏂", "🪂", "🏋‍♀", "🏋", "🤼‍♀", "🤼", "🤸‍♀", "🤸", "⛹‍♀", "⛹", "🤺", "🤾‍♀", "🤾", "🏌‍♀", "🏌", "🏇", "🧘‍♀", "🧘","🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈", "🛫", "🛬", "🛩", "💺", "🛰", "🚀", "🛸",
  // SVG Stickers
  {
    type: "svg",
    path: "M10,0 L20,20 L0,20 Z",
    viewBox: "0 0 20 20",
    name: "triangle"
  },
  {
    type: "svg",
    path: "M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0",
    viewBox: "0 0 20 20",
    name: "circle"
  },
  {
    type: "svg",
    path: "M0,0 L20,0 L20,20 L0,20 Z",
    viewBox: "0 0 20 20",
    name: "square"
  },
  {
    type: "svg",
    path: "M10,0 L20,10 L10,20 L0,10 Z",
    viewBox: "0 0 20 20",
    name: "diamond"
  },
  {
    type: "svg",
    path: "M0,10 Q10,0 20,10 Q10,20 0,10",
    viewBox: "0 0 20 20",
    name: "leaf"
  },
  {
    type: "svg",
    path: "M10,20 L8.5,18.5 C3.4,13.4 0,10.3 0,6.1 C0,2.7 2.7,0 6.1,0 C8,0 9.9,0.9 11,2.3 C12.1,0.9 14,0 15.9,0 C19.3,0 22,2.7 22,6.1 C22,10.3 18.6,13.4 13.5,18.5 L12,20",
    viewBox: "0 0 22 20",
    name: "heart"
  },
  {
    type: "svg",
    path: "M10,0 L13,7 L20,7 L15,12 L17,20 L10,15 L3,20 L5,12 L0,7 L7,7 Z",
    viewBox: "0 0 20 20",
    name: "star"
  },
  {
    type: "svg",
    path: "M5,0 L15,0 L20,10 L15,20 L5,20 L0,10 Z",
    viewBox: "0 0 20 20",
    name: "hexagon"
  },
  {
    type: "svg",
    path: "M10,0 C0,0 0,10 10,10 C20,10 20,0 10,0",
    viewBox: "0 0 20 20",
    name: "cloud"
  },
  {
    type: "svg",
    path: "M0,0 Q10,20 20,0",
    viewBox: "0 0 20 20",
    name: "wave"
  }
];

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 600 });
  const [showShapes, setShowShapes] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  

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

  const addSticker = (sticker) => {
    if (typeof sticker === 'string') {
      // Add emoji sticker
      const text = new fabric.Text(sticker, {
        left: 150,
        top: 150,
        fontSize: 40,
        selectable: true,
      });
      fabricCanvas.current.add(text);
    } else if (sticker.type === 'svg') {
      // Add SVG sticker
      const path = new fabric.Path(sticker.path, {
        left: 150,
        top: 150,
        fill: selectedColor,
        stroke: 'black',
        strokeWidth: 1,
        scaleX: 2,
        scaleY: 2,
      });
      fabricCanvas.current.add(path);
    }
    saveState();
    setShowStickers(false);
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

        <div className="sticker-container">
          <button className="sticker-button" onClick={() => setShowStickers(!showStickers)}>
            <FaSmile /> Stickers
          </button>
          {showStickers && (
            <div className="sticker-dropdown">
              {stickers.map((sticker, index) => (
                <button 
                  key={index} 
                  onClick={() => addSticker(sticker)}
                  className="sticker-item"
                >
                  {typeof sticker === 'string' ? sticker : '⬡'}
                </button>
              ))}
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
        <canvas ref={canvasRef} id="canvas" />
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