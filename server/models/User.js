const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  // This creates the "Relational" link to Projects
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);