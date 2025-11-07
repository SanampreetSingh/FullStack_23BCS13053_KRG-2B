import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Timetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [selectedDay, setSelectedDay] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get className from auth slice
  const className = useSelector((state) => state.auth?.user?.className);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        if (!className) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/class/timetable/${className}`);
        // backend returns the Timetable object directly
        const tt = res.data || null;
        setTimetable(tt);

        // set selected day to current weekday (or 0)
        if (tt) {
          const currentDay = new Date().toLocaleString("default", { weekday: "long" });
          const currentIndex = days.indexOf(currentDay);
          setSelectedDay(currentIndex >= 0 ? currentIndex : 0);
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [className]);

  // ✅ Auto-select current day if timetable exists
  useEffect(() => {
    if (timetable) {
      const currentDay = new Date().toLocaleString("default", { weekday: "long" });
      const currentIndex = days.indexOf(currentDay);
      if (currentIndex !== -1 && timetable.days?.[currentIndex]) {
        setSelectedDay(currentIndex);
      } else {
        setSelectedDay(0);
      }
    }
  }, [timetable]);

  const handledayselect = (index) => {
    setSelectedDay(index);
  };

  if (loading) {
    return (
      <div className="p-6 w-[100vw] flex justify-center items-center">
        <p className="text-lg font-semibold text-[#292321]">Loading timetable...</p>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="p-6 w-[100vw] flex justify-center items-center">
        <p className="text-lg font-semibold text-[#292321]">
          No timetable found for class <span className="font-bold">{className}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 w-[100vw] flex flex-col justify-center items-center gap-8">
      <div>
        <h1 className="text-5xl text-[#292321] font-bold">Timetable</h1>
      </div>

      {/* Days Selector */}
      <div className="w-full flex justify-center pt-4">
        <ul className="flex items-center w-[50%] justify-around">
          {days.map((day, index) => (
            <li
              key={index}
              onClick={() => handledayselect(index)}
              className={`text-[#292321] font-semibold border-2 border-[#292321] p-2 rounded-md w-28 text-center hover:bg-[#292321] hover:text-white cursor-pointer ${
                selectedDay === index ? "bg-[#292321] text-white" : ""
              }`}
            >
              {day}
            </li>
          ))}
        </ul>
      </div>

      {/* Timetable Table */}
      <div>
        <table className="border border-[#292321] border-collapse">
          <thead>
            <tr>
              <th className="border border-[#292321] p-2">Time</th>
              <th className="border border-[#292321] p-2">Subject</th>
              <th className="border border-[#292321] p-2">Teacher</th>
              <th className="border border-[#292321] p-2">Room</th>
            </tr>
          </thead>
          <tbody>
            {timetable?.days?.[selectedDay]?.slots?.map((entry, idx) => (
              <tr key={idx} className="*:text-center *:text-wrap">
                <td className="border border-[#292321] p-2 w-[200px]">{entry.time}</td>
                <td className="border border-[#292321] p-2 w-[200px]">
                  {entry.subject === "Free" || entry.subject === "Break" ? " --- " : entry.subject}
                </td>
                <td className="border border-[#292321] p-2 w-[200px]">
                  {entry.subject === "Free" || entry.subject === "Break" ? " --- " : entry.teacher}
                </td>
                <td className="border border-[#292321] p-2 w-[200px]">
                  {entry.subject === "Free" || entry.subject === "Break" ? " --- " : entry.room}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
