import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Result = () => {
  const [isRegular, setIsRegular] = useState(true);
  const [regularResults, setRegularResults] = useState([]);
  const [semesterResults, setSemesterResults] = useState([]);
  const [sgpa, setSgpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { uid, className } = useSelector((state) => state.auth.user || {});

  useEffect(() => {
    const fetchResults = async () => {
      if (!uid || !className) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (isRegular) {
          const res = await axios.get(`${API_BASE_URL}/result/regular`, {
            params: { uid, className },
          });
          // backend returns null if class not found — normalize to empty array
          setRegularResults(res.data || []);
        } else {
          const res = await axios.get(`${API_BASE_URL}/result/semester`, {
            params: { uid, className },
          });
          const data = res.data || {};
          setSemesterResults(data.subjects || []);
          setSgpa(data.sgpa ?? null);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [uid, className, isRegular]);

  if (loading) return <div className="text-center text-xl mt-10">Loading results...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center gap-12 p-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-[#292321] mb-4">Results</h1>

      {/* Toggle Buttons */}
      <div className="flex gap-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold border-2 border-[#292321] transition-transform duration-200 ${
            isRegular
              ? "bg-[#292321] text-white shadow-lg scale-105"
              : "bg-white text-[#292321]"
          }`}
          onClick={() => setIsRegular(true)}
        >
          Regular Result
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold border-2 border-[#292321] transition-transform duration-200 ${
            !isRegular
              ? "bg-[#292321] text-white shadow-lg scale-105"
              : "bg-white text-[#292321]"
          }`}
          onClick={() => setIsRegular(false)}
        >
          Semester Result
        </button>
      </div>

      {/* ===================== REGULAR RESULTS ===================== */}
      {isRegular ? (
        regularResults.length > 0 ? (
          <div className="w-[85vw] grid grid-cols-3 gap-6 mt-6">
            {regularResults.map((subject, idx) => (
              <div
                key={idx}
                className="bg-[#29232128] p-6 rounded-xl hover:scale-105 transform transition duration-300 shadow-md"
              >
                <h2 className="text-2xl font-bold text-[#292321] mb-3 text-center">
                  {subject.subjectName} ({className})
                </h2>

                <table className="w-full border-collapse border border-[#292321] text-center">
                  <thead>
                    <tr className="bg-[#292321] text-white">
                      <th className="border border-[#292321] p-2">Activity</th>
                      <th className="border border-[#292321] p-2">Marks</th>
                      <th className="border border-[#292321] p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.activities?.map((a, i) => (
                      <tr key={i} className="hover:bg-[#f8f3ef] transition duration-200">
                        <td className="border border-[#292321] p-2">{a.activityName}</td>
                        <td className="border border-[#292321] p-2">{a.marks}</td>
                        <td className="border border-[#292321] p-2">{a.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700">No regular results available.</p>
        )
      ) : (
        /* ===================== SEMESTER RESULTS ===================== */
        <>
          {semesterResults.length > 0 ? (
            <div className="w-[90vw] flex flex-col items-center mt-8">
              <table className="w-full border-collapse border border-[#292321] text-center shadow-lg">
                <thead>
                  <tr className="bg-[#292321] text-white">
                    <th className="border border-[#292321] p-3">Subject</th>
                    <th className="border border-[#292321] p-3">Type</th>
                    <th className="border border-[#292321] p-3">Internal</th>
                    <th className="border border-[#292321] p-3">External</th>
                    <th className="border border-[#292321] p-3">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterResults.map((s, i) => (
                    <tr key={i} className="hover:bg-[#f8f3ef] transition duration-200">
                      <td className="border border-[#292321] p-2">{s.subjectName}</td>
                      <td className="border border-[#292321] p-2">{s.type}</td>
                      <td className="border border-[#292321] p-2">{s.internal ?? "---"}</td>
                      <td className="border border-[#292321] p-2">{s.external ?? "---"}</td>
                      <td className="border border-[#292321] p-2">{s.grade ?? "---"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sgpa !== null && (
                <div className="mt-6 text-xl font-semibold text-[#292321]">
                  SGPA: {sgpa}
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-700">No semester results available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Result;
