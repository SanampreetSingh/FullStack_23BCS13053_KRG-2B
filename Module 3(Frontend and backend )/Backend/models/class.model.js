const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  total: {
    type: Number,
    required: true
  }
}, { _id: false });

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["Graded", "Non-Graded"],
    default: "Graded"
  },
  credits: {
    type: Number,
    required: function () {
      return this.type === "Graded";
    }
  },
  internal: {
    type: Number,
    required: true
  },
  external: {
    type: Number,
    required: true
  },
  activities: [activitySchema]
});

const studentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  subjects: [subjectSchema],
  students: [studentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Class", classSchema);
