const express = require("express");
const Project = require("../models/Project");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Save Project
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { title, jsonData } = req.body;
    const newProject = new Project({ userId: req.user.userId, title, jsonData });
    await newProject.save();
    res.json({ message: "Project saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Projects
router.get("/my-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
