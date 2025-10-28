const mongoose = require("mongoose");

const fullDaySlots = [
  "9:30 AM - 10:20 AM","10:20 AM - 11:10 AM","11:10 AM - 12:00 PM",
  "12:00 PM - 12:30 PM","12:30 PM - 1:20 PM","1:20 PM - 2:10 PM",
  "2:10 PM - 3:00 PM","3:10 PM - 4:00 PM","4:00 PM - 4:20 PM"
];

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  subject: { type: String, default: "---" },
  teacher: { type: String, default: "---" },
  room: { type: String, default: "---" }
}, { _id: false });

const daySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true
  },
  slots: {
    type: [slotSchema],
    default: () => fullDaySlots.map(time => ({ time }))
  }
});

const timetableSchema = new mongoose.Schema({
  classRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
    unique: true
  },
  className: { type: String, required: true },
  days: {
    type: [daySchema],
    default: () => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      .map(name => ({ name })) // slots will automatically fill using daySchema default
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Timetable", timetableSchema);
