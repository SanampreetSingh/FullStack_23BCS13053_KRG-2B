const Result = require("../models/result.model");
const Class =require("../models/class.model");
exports.saveResults = async (req, res) => {
  console.log(req.body);

  try {
    const { classId, subjectName, type, activityName, marks } = req.body;

    // Basic validation
    if (!classId || !subjectName || !type || !marks) {
      console.log("Missing or invalid fields");
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    console.log("Processing results save/update...");

    // ----- 🟢 REGULAR -----
    if (type === "Regular") {
      if (!activityName) {
        return res.status(400).json({ message: "activityName required for Regular type" });
      }

      // Build update fields dynamically like marks.23bcs13053 = 5
      const updateFields = {};
      for (const [studentId, mark] of Object.entries(marks)) {
        updateFields[`marks.${studentId}`] = Number(mark) || 0;
      }

      await Result.updateOne(
        { classId, subjectName, type, activityName },
        { $set: { ...updateFields, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({ message: "Regular results saved successfully" });
    }

    // ----- 🔵 SEMESTER -----
    else if (type === "Semester") {
      // Must have both internal and external objects
      if (!marks.internal || !marks.external) {
        return res.status(400).json({ message: "Missing internal or external marks" });
      }

      // Build update fields for internal and external separately
      const updateFields = {};
      for (const [studentId, mark] of Object.entries(marks.internal)) {
        updateFields[`marks.internal.${studentId}`] = Number(mark) || 0;
      }
      for (const [studentId, mark] of Object.entries(marks.external)) {
        updateFields[`marks.external.${studentId}`] = Number(mark) || 0;
      }

      await Result.updateOne(
        { classId, subjectName, type },
        { $set: { ...updateFields, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({ message: "Semester results saved successfully" });
    }

    // ----- 🚫 INVALID TYPE -----
    else {
      return res.status(400).json({ message: "Invalid type provided" });
    }
  } catch (error) {
    console.error("❌ Error saving results:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ------------------------------------------------------
 ✅ 2. Fetch Existing Results (Admin)
------------------------------------------------------ */
exports.getExistingResults = async (req, res) => {
  try {
    const { classId, type, subjectName, activityName } = req.body;

    if (!classId || !type || !subjectName) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    // 🧩 Build query filter
    const filter = { classId, type, subjectName };
    if (type === "Regular" && activityName) {
      filter.activityName = activityName;
    }

    console.log("Fetching existing results with filter:", filter);

    const result = await Result.findOne(filter).lean();
    console.log(result);

    if (!result) {
      return res.status(200).json({
        existing: false,
        message: "No existing result data found.",
      });
    }

    // 🟢 Match frontend format exactly
    if (type === "Regular") {
      return res.status(200).json({
        existing: true,
        results: {
          type,
          subjectName,
          activityName: result.activityName,
          marks: result.marks || {},
        },
      });
    } else if (type === "Semester") {
      return res.status(200).json({
        existing: true,
        results: {
          type,
          subjectName,
          internal: result.marks?.internal || {},
          external: result.marks?.external || {},
        },
      });
    }

    return res.status(400).json({ message: "Invalid result type." });
  } catch (error) {
    console.error("❌ Error fetching existing results:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


// 🧮 Helper: Grade Calculator
function calculateGrade(total) {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B+";
  if (total >= 60) return "B";
  if (total >= 50) return "C+";
  if (total >= 40) return "C";
  return "F";
}

// 🧮 Helper: SGPA Calculator (only Graded subjects count)
function calculateSGPA(subjects) {
  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach((s) => {
    if (s.type === "Non-Graded") return;

    const grade = s.grade;
    const credits = s.credits || 0;
    let points = 0;

    switch (grade) {
      case "A+": points = 10; break;
      case "A": points = 9; break;
      case "B+": points = 8; break;
      case "B": points = 7; break;
      case "C+": points = 6; break;
      case "C": points = 5; break;
      default: points = 0; break;
    }

    totalCredits += credits;
    totalPoints += credits * points;
  });

  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

// 📘 REGULAR RESULTS
exports.getRegularResults = async (req, res) => {

  try {
    const { className, uid } = req.query;
    console.log(className,uid);
    if (!className || !uid) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    // Find class by name to get classId
    const classData = await Class.findOne({ className }).lean();
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Fetch all Regular results for that class
    const results = await Result.find({ classId: classData._id, type: "Regular" }).lean();

    // Group results by subject
    const data = {};

    results.forEach((r) => {
      const studentMarks = r.marks?.[uid];
      if (!studentMarks) return; // skip if student not present

      if (!data[r.subjectName]) data[r.subjectName] = [];

      data[r.subjectName].push({
        activityName: r.activityName || "N/A",
        marks: studentMarks,
        total: "10", // optional (can fetch from Class.activities if needed)
      });
    });

    // Convert object → array for frontend
    const formatted = Object.entries(data).map(([subjectName, activities]) => ({
      subjectName,
      activities,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching regular results:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🎓 SEMESTER RESULTS
exports.getSemesterResults = async (req, res) => {
  try {
    const { className, uid } = req.query;
    if (!className || !uid) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const classData = await Class.findOne({ className }).lean();
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const results = await Result.find({ classId: classData._id, type: "Semester" }).lean();

    console.log("Subjects in class:", classData.subjects.map((s) => s.name));
    console.log("Subjects in results:", results.map((r) => r.subjectName));

    const subjects = classData.subjects.map((subject) => {
      const subjectResult = results.find(
        (r) => r.subjectName?.trim().toLowerCase() === subject.name?.trim().toLowerCase()
      );

      let marks = null;
      if (subjectResult?.marks) {
        const internalMark = subjectResult.marks.internal?.[uid];
        const externalMark = subjectResult.marks.external?.[uid];
        if (internalMark !== undefined || externalMark !== undefined) {
          marks = { internal: internalMark, external: externalMark };
        }
      }

      let internal = "---";
      let external = "---";
      let total = null;

      if (marks && typeof marks === "object") {
        internal = marks.internal ?? "---";
        external = marks.external ?? "---";
        if (internal !== "---" && external !== "---") {
          total = Number(internal) + Number(external);
        }
      }

      const grade = total !== null ? calculateGrade(total) : "---";

      return {
        subjectName: subject.name,
        type: subject.type,
        internal,
        external,
        grade,
        credits: subject.credits || 0,
      };
    });

    const sgpa = calculateSGPA(subjects);
    res.status(200).json({ subjects, sgpa });
  } catch (error) {
    console.error("Error fetching semester results:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
