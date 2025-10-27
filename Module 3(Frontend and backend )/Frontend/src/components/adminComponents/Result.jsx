import React, { useState, useEffect } from "react";

const classData = [
  {
    name: "Class 1",
    students: [
      { uid: "S001", name: "John Doe" },
      { uid: "S002", name: "Jane Smith" },
      { uid: "S003", name: "Alice Brown" },
    ],
    subjects: [
      {
        name: "Math",
        internal: 20,
        external: 80,
        activities: [
          { name: "MST1", total: 10 },
          { name: "MST2", total: 10 },
        ],
      },
      {
        name: "Science",
        internal: 15,
        external: 85,
        activities: [
          { name: "MST1", total: 12 },
          { name: "MST2", total: 13 },
        ],
      },
    ],
  },
  {
    name: "Class 2",
    students: [
      { uid: "S101", name: "Bob Marley" },
      { uid: "S102", name: "Clara Oswald" },
    ],
    subjects: [
      {
        name: "History",
        internal: 25,
        external: 75,
        activities: [
          { name: "MST1", total: 10 },
          { name: "MST2", total: 15 },
        ],
      },
    ],
  },
];

const ResultPage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [type, setType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [marksData, setMarksData] = useState({});
  const [confirmed, setConfirmed] = useState(false); // NEW

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

  const handleSubmit = () => {
    console.log({ class: selectedClass.name, type, marksData });
    alert("Data submitted! Check console.");
  };

  // Reset confirmation when any selection changes
  const resetConfirmation = () => setConfirmed(false);

  return (
    <div className="w-full flex flex-col items-center gap-8 p-6">
      <h1 className="text-5xl font-bold text-[#292321] mb-4">Enter Results</h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full justify-center">
        {/* Class Selection */}
        <div className="flex gap-4 items-center">
          <label className="font-semibold text-[#424141]">Class:</label>
          <select
            value={selectedClass?.name || ""}
            onChange={(e) => {
              const cls = classData.find((c) => c.name === e.target.value);
              setSelectedClass(cls);
              setType("");
              setSelectedSubject(null);
              setSelectedActivity(null);
              resetConfirmation();
            }}
            className="border border-[#292321] p-2 rounded-lg"
          >
            <option value="">Select Class</option>
            {classData.map((cls) => (
              <option key={cls.name} value={cls.name}>
                {cls.name}
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
                resetConfirmation();
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
                if (type === "Regular") setSelectedActivity(null);
                resetConfirmation();
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
                resetConfirmation();
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
          onClick={() => setConfirmed(true)}
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
                      <tr
                        key={stu.uid}
                        className="hover:bg-[#f0ebe4] transition duration-200"
                      >
                        <td className="border border-[#292321] p-2">{stu.uid}</td>
                        <td className="border border-[#292321] p-2">{stu.name}</td>
                        <td className="border border-[#292321] p-2">
                          <input
                            id={`${selectedSubject.name}-${selectedActivity.name}-${stu.uid}`}
                            name={`${selectedSubject.name}-${selectedActivity.name}-${stu.uid}`}
                            type="text"
                            value={
                              marksData[selectedSubject.name]?.[
                                selectedActivity.name
                              ]?.[stu.uid] || ""
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
                            pattern="\d*"
                            className="w-full border border-gray-300 p-1 rounded focus:ring-1 focus:ring-[#292321]"
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
                      <tr
                        key={stu.uid}
                        className="hover:bg-[#f0ebe4] transition duration-200"
                      >
                        <td className="border border-[#292321] p-2">{stu.uid}</td>
                        <td className="border border-[#292321] p-2">{stu.name}</td>
                        <td className="border border-[#292321] p-2">
                          <input
                            id={`${selectedSubject.name}-internal-${stu.uid}`}
                            name={`${selectedSubject.name}-internal-${stu.uid}`}
                            type="text"
                            value={
                              marksData[selectedSubject.name]?.[stu.uid]
                                ?.internal || ""
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
                            pattern="\d*"
                            className="w-full border border-gray-300 p-1 rounded focus:ring-1 focus:ring-[#292321]"
                          />
                        </td>
                        <td className="border border-[#292321] p-2">
                          <input
                            id={`${selectedSubject.name}-external-${stu.uid}`}
                            name={`${selectedSubject.name}-external-${stu.uid}`}
                            type="text"
                            value={
                              marksData[selectedSubject.name]?.[stu.uid]
                                ?.external || ""
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
                            pattern="\d*"
                            className="w-full border border-gray-300 p-1 rounded focus:ring-1 focus:ring-[#292321]"
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

      {/* Submit button */}
      {confirmed &&
        ((type === "Semester" && selectedSubject) ||
          (type === "Regular" && selectedActivity)) && (
          <div className="flex justify-end mt-4 w-full max-w-5xl">
            <button
              onClick={handleSubmit}
              className="bg-[#292321] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#424141] transition duration-200"
            >
              Submit
            </button>
          </div>
        )}
    </div>
  );
};

export default ResultPage;
