import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ResultPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [type, setType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [marksData, setMarksData] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/class/get`);
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // 🧩 Fetch class details by ID
  const handleClassSelect = async (classId) => {
    if (!classId) {
      setSelectedClass(null);
      setType("");
      setSelectedSubject(null);
      setSelectedActivity(null);
      setConfirmed(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/class/admin/${classId}`);
      setSelectedClass(res.data);
      setType("");
      setSelectedSubject(null);
      setSelectedActivity(null);
      setConfirmed(false);
    } catch (err) {
      console.error("Error fetching class details:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Initialize marks structure when class or type changes
  useEffect(() => {
    if (!selectedClass || !type) return;

    const data = {};
    selectedClass.subjects.forEach((subj) => {
      if (type === "Regular") {
        data[subj.name] = {};
        subj.activities.forEach((act) => {
          data[subj.name][act.name] = {};
          selectedClass.students.forEach((stu) => {
            data[subj.name][act.name][stu.uid] = "";
          });
        });
      } else {
        data[subj.name] = {};
        selectedClass.students.forEach((stu) => {
          data[subj.name][stu.uid] = { internal: "", external: "" };
        });
      }
    });
    setMarksData(data);
  }, [selectedClass, type]);

  // 🧩 Fetch existing results
  const handleConfirm = async () => {
    if (!selectedClass || !selectedSubject || !type) return;

    try {
      setConfirmed(true);
      setLoading(true);

      const payload = {
        classId: selectedClass._id,
        subjectName: selectedSubject.name,
        type,
        activityName: type === "Regular" ? selectedActivity?.name : undefined,
      };

      const res = await axios.post(`${API_BASE_URL}/result/existing`, payload);
      const existing = res.data;

      if (existing?.existing) {
        setMarksData((prev) => {
          const updated = { ...prev };

          if (type === "Regular" && selectedActivity) {
            selectedClass.students.forEach((stu) => {
              updated[selectedSubject.name][selectedActivity.name][stu.uid] =
                existing.results?.marks?.[stu.uid] || "";
            });
          } else if (type === "Semester") {
            selectedClass.students.forEach((stu) => {
              updated[selectedSubject.name][stu.uid] = {
                internal: existing.results.internal?.[stu.uid] || "",
                external: existing.results.external?.[stu.uid] || "",
              };
            });
          }

          return updated;
        });
      } else {
        console.log("No existing result data found.");
      }
    } catch (err) {
      console.error("Error fetching existing result:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 Handle Regular input change
  const handleRegularChange = (subject, activity, uid, value, max) => {
    if (!/^\d*$/.test(value)) return;
    if (Number(value) > max) return;
    setMarksData((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [activity]: { ...prev[subject][activity], [uid]: value },
      },
    }));
  };

  // 🔢 Handle Semester input change
  const handleSemesterChange = (subject, uid, field, value, max) => {
    if (!/^\d*$/.test(value)) return;
    if (Number(value) > max) return;
    setMarksData((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [uid]: { ...prev[subject][uid], [field]: value },
      },
    }));
  };

  // 💾 Save Result
  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !type) {
      alert("Please select Class, Type, and Subject before saving.");
      return;
    }

    try {
      setLoading(true);

      let payload = {
        classId: selectedClass._id,
        subjectName: selectedSubject.name,
        type,
      };

      // 🟩 Regular
      if (type === "Regular" && selectedActivity) {
        payload.activityName = selectedActivity.name;
        payload.marks = {};

        selectedClass.students.forEach((stu) => {
          const val =
            marksData?.[selectedSubject.name]?.[selectedActivity.name]?.[stu.uid] ||
            "";
          payload.marks[stu.uid] = val;
        });
      }
      // 🟨 Semester
      else if (type === "Semester") {
        payload.marks = {
          internal: {},
          external: {},
        };

        selectedClass.students.forEach((stu) => {
          payload.marks.internal[stu.uid] =
            marksData?.[selectedSubject.name]?.[stu.uid]?.internal || "";
          payload.marks.external[stu.uid] =
            marksData?.[selectedSubject.name]?.[stu.uid]?.external || "";
        });
      }

      const res = await axios.post(`${API_BASE_URL}/result/save`, payload);

      if (res.status === 200) {
        alert("✅ Result saved successfully!");
      } else {
        alert("⚠️ Something went wrong while saving results.");
      }
    } catch (err) {
      console.error("Error saving result:", err);
      alert("❌ Failed to save results. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 🧱 UI Section
  return (
    <div className="w-full flex flex-col items-center gap-8 p-6">
      <h1 className="text-5xl font-bold text-[#292321] mb-4">Enter Results</h1>

      {/* --- Selection Section --- */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full justify-center">
        {/* Class Selection */}
        <div className="flex gap-4 items-center">
          <label className="font-semibold text-[#424141]">Class:</label>
          <select
            onChange={(e) => handleClassSelect(e.target.value)}
            className="border border-[#292321] p-2 rounded-lg"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        {/* Type Selection */}
        {selectedClass && (
          <div className="flex gap-4 items-center">
            <label className="font-semibold text-[#424141]">Type:</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSelectedSubject(null);
                setSelectedActivity(null);
                setConfirmed(false);
              }}
              className="border border-[#292321] p-2 rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="Regular">Regular</option>
              <option value="Semester">Semester</option>
            </select>
          </div>
        )}

        {/* Subject Selection */}
        {type && selectedClass && (
          <div className="flex gap-4 items-center">
            <label className="font-semibold text-[#424141]">Subject:</label>
            <select
              value={selectedSubject?.name || ""}
              onChange={(e) => {
                const subj = selectedClass.subjects.find(
                  (s) => s.name === e.target.value
                );
                setSelectedSubject(subj);
                setSelectedActivity(null);
                setConfirmed(false);
              }}
              className="border border-[#292321] p-2 rounded-lg"
            >
              <option value="">Select Subject</option>
              {selectedClass.subjects.map((subj) => (
                <option key={subj.name} value={subj.name}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Activity Selection */}
        {type === "Regular" && selectedSubject && (
          <div className="flex gap-4 items-center">
            <label className="font-semibold text-[#424141]">Activity:</label>
            <select
              value={selectedActivity?.name || ""}
              onChange={(e) => {
                const act = selectedSubject.activities.find(
                  (a) => a.name === e.target.value
                );
                setSelectedActivity(act);
                setConfirmed(false);
              }}
              className="border border-[#292321] p-2 rounded-lg"
            >
              <option value="">Select Activity</option>
              {selectedSubject.activities.map((act) => (
                <option key={act.name} value={act.name}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      {(type === "Semester" && selectedSubject) ||
      (type === "Regular" && selectedActivity) ? (
        <button
          onClick={handleConfirm}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Confirm Selection
        </button>
      ) : null}

      {/* Marks Table */}
      {confirmed &&
        ((type === "Semester" && selectedSubject) ||
          (type === "Regular" && selectedActivity)) && (
          <div className="w-full max-w-5xl border-2 border-[#292321] rounded-xl p-4 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-[#292321]">
              {selectedSubject.name}
            </h2>

            {type === "Regular" ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#292321]">
                  <thead>
                    <tr>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        UID
                      </th>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        Name
                      </th>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        Marks (Max: {selectedActivity.total})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.students.map((stu) => (
                      <tr key={stu.uid}>
                        <td className="border border-[#292321] p-2">{stu.uid}</td>
                        <td className="border border-[#292321] p-2">{stu.name}</td>
                        <td className="border border-[#292321] p-2">
                          <input
                            type="text"
                            value={
                              marksData[selectedSubject.name]?.[selectedActivity.name]?.[
                                stu.uid
                              ] || ""
                            }
                            onChange={(e) =>
                              handleRegularChange(
                                selectedSubject.name,
                                selectedActivity.name,
                                stu.uid,
                                e.target.value,
                                selectedActivity.total
                              )
                            }
                            className="w-full border border-gray-300 p-1 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#292321]">
                  <thead>
                    <tr>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        UID
                      </th>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        Name
                      </th>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        Internal (Max: {selectedSubject.internal})
                      </th>
                      <th className="border border-[#292321] p-2 bg-[#292321] text-white">
                        External (Max: {selectedSubject.external})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.students.map((stu) => (
                      <tr key={stu.uid}>
                        <td className="border border-[#292321] p-2">{stu.uid}</td>
                        <td className="border border-[#292321] p-2">{stu.name}</td>
                        <td className="border border-[#292321] p-2">
                          <input
                            type="text"
                            value={
                              marksData[selectedSubject.name]?.[stu.uid]?.internal || ""
                            }
                            onChange={(e) =>
                              handleSemesterChange(
                                selectedSubject.name,
                                stu.uid,
                                "internal",
                                e.target.value,
                                selectedSubject.internal
                              )
                            }
                            className="w-full border border-gray-300 p-1 rounded"
                          />
                        </td>
                        <td className="border border-[#292321] p-2">
                          <input
                            type="text"
                            value={
                              marksData[selectedSubject.name]?.[stu.uid]?.external || ""
                            }
                            onChange={(e) =>
                              handleSemesterChange(
                                selectedSubject.name,
                                stu.uid,
                                "external",
                                e.target.value,
                                selectedSubject.external
                              )
                            }
                            className="w-full border border-gray-300 p-1 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      {/* Submit */}
      {confirmed &&
        ((type === "Semester" && selectedSubject) ||
          (type === "Regular" && selectedActivity)) && (
          <div className="flex justify-end mt-4 w-full max-w-5xl">
            <button
              onClick={handleSubmit}
              className="bg-[#292321] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#424141]"
            >
              Submit
            </button>
          </div>
        )}
    </div>
  );
};

export default ResultPage;
