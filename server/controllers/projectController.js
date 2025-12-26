const axios = require('axios');
const Project = require('../models/Project');

// 1. Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// 2. Add a project
exports.addProject = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    // Cleanup URL
    const cleanUrl = repoUrl.replace(/\/$/, ""); 
    const urlParts = cleanUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    
    const newProject = new Project({
      owner: req.user.id,
      // Use the avatar from req.user (provided by JWT/Protect middleware)
      postedByUsername: req.user.username,
      postedByAvatar: req.user.avatar || `https://ui-avatars.com/api/?name=${req.user.username}`,
      
      title: response.data.name,
      repoUrl: repoUrl,
      description: response.data.description || "No description provided.",
      stars: response.data.stargazers_count,
      language: response.data.language || "Other"
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("POST PROJECT ERROR:", error.message);
    res.status(500).json({ message: "GitHub API Error or Invalid URL" });
  }
};

// 3. Toggle Upvote
exports.toggleUpvote = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ensure upvotes array exists
    if (!project.upvotes) project.upvotes = [];

    const index = project.upvotes.indexOf(req.user.id);
    
    if (index === -1) {
      project.upvotes.push(req.user.id); // Like
    } else {
      project.upvotes.splice(index, 1); // Unlike
    }

    await project.save();
    // Return the full project object so the frontend can update the heart count/color
    res.status(200).json(project);
  } catch (error) {
    console.error("UPVOTE ERROR:", error);
    res.status(500).json({ message: "Server error toggling upvote" });
  }
};

// 4. Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    
    // Only allow the person who posted it to delete it
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete error" });
  }
};