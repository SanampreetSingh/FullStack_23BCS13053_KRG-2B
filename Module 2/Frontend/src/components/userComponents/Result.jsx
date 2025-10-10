import React, { useState, useRef } from "react";
import { GiCrossedBones } from "react-icons/gi";

const studentResult = {
  regularResult: {
    Math: { MST1: 15, MST2: 16, Practical: 10 },
    Physics: { MST1: 18, MST2: 20, Experiment: 12 },
    Chemistry: { MST1: 20, MST2: 19, Experiment: 14 },
    CS: { MST1: 17, MST2: 18 },
    English: { MST1: 19, MST2: 17 },
  },
  semesterResult: {
    1: {
      period: "Aug 2023 - Dec 2023",
      sgpa: 8.2,
      totalCredits: 22,
      subjects: [
        { name: "Math", type: "graded", credit: 4, internal: 25, external: 45, totalInternal: 25, totalExternal: 45, grade: "A" },
        { name: "Physics", type: "graded", credit: 4, internal: 20, external: 45, totalInternal: 20, totalExternal: 45, grade: "B" },
        { name: "Chemistry Lab", type: "non-graded", credit: 2, internal: 22, external: 0, totalInternal: 22, totalExternal: 0, grade: "Pass" },
        { name: "CS", type: "graded", credit: 4, internal: 23, external: 45, totalInternal: 23, totalExternal: 45, grade: "B+" },
        { name: "English", type: "graded", credit: 4, internal: 25, external: 50, totalInternal: 25, totalExternal: 50, grade: "A+" }
      ]
    },
    2: {
      period: "Jan 2024 - May 2024",
      sgpa: 8.35,
      totalCredits: 24,
      subjects: [
        { name: "Math II", type: "graded", credit: 4, internal: 28, external: 48, totalInternal: 28, totalExternal: 48, grade: "A+" },
        { name: "Physics II", type: "graded", credit: 4, internal: 22, external: 46, totalInternal: 22, totalExternal: 46, grade: "B+" },
        { name: "Chemistry Lab II", type: "non-graded", credit: 2, internal: 24, external: 0, totalInternal: 24, totalExternal: 0, grade: "Pass" },
        { name: "CS II", type: "graded", credit: 4, internal: 26, external: 48, totalInternal: 26, totalExternal: 48, grade: "A" },
        { name: "English II", type: "graded", credit: 4, internal: 25, external: 50, totalInternal: 25, totalExternal: 50, grade: "A+" }
      ]
    }
  }
};

const Result = () => {
  const [isRegular, setIsRegular] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("1");
  const modalRef = useRef();

  const handleSemesterClick = (sem) => {
    setSelectedSemester(sem);
    modalRef.current.hidden = false;
  };

  const closeModal = () => modalRef.current.hidden = true;

  return (
    <div className="w-full flex flex-col items-center gap-12 p-6">

      {/* Heading */}
      <h1 className="text-5xl font-bold text-[#292321] mb-4">Results</h1>

      {/* Result Type Toggle */}
      <div className="flex gap-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold border-2 border-[#292321] transition-transform duration-200 ${
            isRegular ? "bg-[#292321] text-white shadow-lg scale-105" : "bg-white text-[#292321]"
          }`}
          onClick={() => setIsRegular(true)}
        >
          Regular Result
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold border-2 border-[#292321] transition-transform duration-200 ${
            !isRegular ? "bg-[#292321] text-white shadow-lg scale-105" : "bg-white text-[#292321]"
          }`}
          onClick={() => setIsRegular(false)}
        >
          Semester Result
        </button>
      </div>

      {/* Regular Result Grid */}
      {isRegular && (
        <div className="w-[80vw] grid grid-cols-3 gap-6 mt-6">
          {Object.entries(studentResult.regularResult).map(([subject, marks]) => (
            <div key={subject} className="bg-[#29232128] p-6 rounded-xl flex flex-col gap-2 hover:scale-105 transform transition duration-300">
              <h2 className="text-2xl font-bold text-[#292321] mb-2">{subject}</h2>
              <ul>
                {Object.entries(marks).map(([exam, score]) => (
                  <li key={exam} className="flex justify-between">
                    <span>{exam}</span> <span>{score}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Semester Result Grid */}
      {!isRegular && (
        <div className="w-[80vw] grid grid-cols-3 gap-6 mt-6">
          {Object.entries(studentResult.semesterResult).map(([sem, data]) => (
            <div
              key={sem}
              className="bg-[#29232128] p-6 rounded-xl cursor-pointer hover:scale-105 transform transition duration-300"
              onClick={() => handleSemesterClick(sem)}
            >
              <h2 className="text-2xl font-bold text-[#292321] mb-2">Semester {sem}</h2>
              <p className="text-xl">Period: {data.period}</p>
              <p className="text-xl">SGPA: {data.sgpa}</p>
              <p className="text-xl">Total Credits: {data.totalCredits}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Semester Details */}
      <div
        ref={modalRef}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
        hidden
      >
        <div className="bg-[#d6d3ce] p-6 rounded-xl shadow-2xl w-[95%] max-w-6xl relative animate-slide-up overflow-auto max-h-[90vh]">
          <GiCrossedBones
            className="absolute top-4 right-4 text-3xl cursor-pointer text-[#292321]"
            onClick={closeModal}
          />
          <h2 className="text-3xl font-bold text-[#292321] mb-4">
            Semester {selectedSemester} Details
          </h2>
          <table className="w-full border-collapse border border-[#292321] text-center">
            <thead>
              <tr>
                {["Subject","Type","Credit","Internal","Total Internal","External","Total External","Grade"].map((head) => (
                  <th key={head} className="border border-[#292321] p-2 bg-[#292321] text-white">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentResult.semesterResult[selectedSemester].subjects.map((subj, idx) => (
                <tr key={idx} className="hover:bg-[#f0ebe4] transition duration-200">
                  <td className="border border-[#292321] p-2">{subj.name}</td>
                  <td className="border border-[#292321] p-2">{subj.type}</td>
                  <td className="border border-[#292321] p-2">{subj.credit}</td>
                  <td className="border border-[#292321] p-2">{subj.internal}</td>
                  <td className="border border-[#292321] p-2">{subj.totalInternal}</td>
                  <td className="border border-[#292321] p-2">{subj.external}</td>
                  <td className="border border-[#292321] p-2">{subj.totalExternal}</td>
                  <td className="border border-[#292321] p-2">{subj.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from {opacity:0} to {opacity:1} }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up { from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Result;
