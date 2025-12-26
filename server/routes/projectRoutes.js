const express = require('express');
const router = express.Router();
// Correctly destructure all 4 functions from the controller
const { 
  addProject, 
  getProjects, 
  deleteProject, 
  toggleUpvote 
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');

// 1. PUBLIC ROUTE: Anyone can see the feed
router.get('/', getProjects);

// 2. PROTECTED ROUTE: Must be logged in to post a project
router.post('/', protect, addProject);

// 3. PROTECTED ROUTE: Toggle like/upvote on a specific project
// The :id in the URL will be the project's MongoDB ID
router.post('/:id/upvote', protect, toggleUpvote);

// 4. PROTECTED ROUTE: Delete a project
router.delete('/:id', protect, deleteProject);

module.exports = router;