const Class = require("../models/class.model");
const Timetable = require("../models/timetable.schema");

// Create Class and automatically create timetable
exports.createClass = async (req, res) => {
  let newClass;
  try {
    const { className, subjects } = req.body;

    if (!className || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "Class name and at least one subject are required" });
    }

    // Check duplicate
    const existingClass = await Class.findOne({ className });
    if (existingClass) {
      return res.status(400).json({ message: "Class name already exists" });
    }

    // Create class
    newClass = new Class({ className, subjects });
    await newClass.save();

    // Create timetable (days & slots default to model)
    const newTimetable = new Timetable({
      classRef: newClass._id,
      className: newClass.className
    });
    await newTimetable.save();

    res.status(201).json({
      message: "Class and timetable created successfully",
      class: newClass,
      timetable: newTimetable
    });

  } catch (error) {
    console.error("Error creating class or timetable:", error);
    if (newClass) await Class.findByIdAndDelete(newClass._id);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};


exports.getclassesadmin=async (req, res) => {
  try {
    const {classId}=req.params;
    const classes = await Class.findById(classId).sort({ className: 1 });
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

// Get all classes (for dropdown)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().select("_id className").sort({ className: 1 });
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Get timetable for a specific class
exports.getTimetable = async (req, res) => {
  try {
    console.log(req.params);
   const { classname } = req.params; // <- use params, not body
    const timetable = await Timetable.findOne({ className: classname });

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.status(200).json({ timetable });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};


// Create timetable manually (if it does not exist yet)
exports.createTimetable = async (req, res) => {
  try {
    const { classRef, className, days } = req.body;

    if (!classRef || !className) {
      return res.status(400).json({ message: "Class reference and name are required" });
    }

    // Prevent duplicate
    const existingTimetable = await Timetable.findOne({ classRef });
    if (existingTimetable) {
      return res.status(400).json({ message: "Timetable already exists for this class" });
    }

    const newTimetable = new Timetable({
      classRef,
      className,
      days: days || undefined
    });
    await newTimetable.save();

    res.status(201).json({
      message: "Timetable created successfully",
      timetable: newTimetable
    });
  } catch (error) {
    console.error("Error creating timetable:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Update existing timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { classRef, days } = req.body;

    if (!classRef || !days || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: "Class reference and days are required" });
    }

    const timetable = await Timetable.findOne({ classRef });

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found for this class" });
    }

    timetable.days = days;
    await timetable.save();

    res.status(200).json({
      message: "Timetable updated successfully",
      timetable
    });

  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
