const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Regular", "Semester"],
    required: true,
  },
  // 🟢 For Regular
  activityName: {
    type: String,
  },
  marks: {
    type: mongoose.Schema.Types.Mixed, // will store { uid: marks } object
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

resultSchema.index({ classId: 1, subjectName: 1, type: 1, activityName: 1 });

module.exports = mongoose.model("Result", resultSchema);
