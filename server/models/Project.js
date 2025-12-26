const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Adding these to display the poster's identity easily
  postedByUsername: { type: String, required: true },
  postedByAvatar: { type: String }, 
  
  title: { type: String, required: true },
  repoUrl: { type: String, required: true },
  description: { type: String },
  stars: { type: Number, default: 0 },
  language: { type: String },
  
  // Array of User IDs who liked this project
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);