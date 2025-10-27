const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    minlength: 10
  },
  by: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String, 
    required: true
  },
  time: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Announcement", announcementSchema);
