const express = require("express");
const Project = require("../models/Project");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Save Project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, data } = req.body;
    const newProject = new Project({ userId: req.user.id, name, data });

    await newProject.save();
    res.status(201).json({ message: "Project saved" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get User's Projects
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
