import React, { useState, useEffect } from "react";
import axios from "axios";

const fullDaySlots = [
  "9:30 AM - 10:20 AM","10:20 AM - 11:10 AM","11:10 AM - 12:00 PM",
  "12:00 PM - 12:30 PM","12:30 PM - 1:20 PM","1:20 PM - 2:10 PM",
  "2:10 PM - 3:00 PM","3:10 PM - 4:00 PM","4:00 PM - 4:20 PM"
];
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const Timetable = () => {
  const currentDay = new Date().toLocaleString("default", { weekday: "long" });
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [timetable, setTimetable] = useState({});
  const [selectedDay, setSelectedDay] = useState(0);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all classes from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${backendURL}/class/get`);
        setClasses(response.data);
        if (response.data.length > 0) {
          setSelectedClass(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch timetable when class is selected
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedClass) return;
      try {
      

        const response = await axios.get(`${backendURL}/class/timetable/${selectedClass}`);
        const timetableData = response.data.timetable || {};

        // Convert backend array to frontend object
        const mapDays = {};
        (timetableData.days || []).forEach(day => {
          mapDays[day.name] = day.slots;
        });

        setTimetable(mapDays);
      } catch (error) {
        console.error("Error fetching timetable:", error);

        // Initialize blank timetable if none exists
        const blankTimetable = {};
        days.forEach(day => {
          blankTimetable[day] = fullDaySlots.map(slot => ({
            time: slot,
            subject: "---",
            teacher: "---",
            room: "---"
          }));
        });
        setTimetable(blankTimetable);
      }
    };
    fetchTimetable();
  }, [selectedClass]);

  // Set current day
  useEffect(() => {
    const currentIndex = days.indexOf(currentDay);
    setSelectedDay(currentIndex >= 0 ? currentIndex : 0);
  }, [currentDay]);

  const handleClassSelect = (e) => setSelectedClass(e.target.value);
  const handleDaySelect = (index) => setSelectedDay(index);

  const getFullDayTimetable = () => timetable[days[selectedDay]] || [];

  const handleInputChange = (index, field, value) => {
    const daySlots = getFullDayTimetable();
    daySlots[index][field] = value;
    setTimetable(prev => ({
      ...prev,
      [days[selectedDay]]: daySlots
    }));
  };

  const saveTimetable = async () => {
    try {
      await axios.put(`${backendURL}/class/updatetimetable`, {
        classRef: selectedClass,
        days: Object.keys(timetable).map(day => ({
          name: day,
          slots: timetable[day]
        }))
      });
      alert("✅ Timetable saved successfully!");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("❌ Failed to save timetable.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-12 p-6">
      <h1 className="text-5xl font-bold text-[#292321] mb-4">Timetable</h1>

      <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
        {/* Class and Day Selector */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="font-semibold text-[#292321]">Select Class:</label>
          <select
            value={selectedClass || ""}
            onChange={handleClassSelect}
            className="border border-[#292321] p-2 rounded-md"
          >
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.className}</option>
            ))}
          </select>

          <label className="font-semibold text-[#292321]">Select Day:</label>
          <ul className="flex gap-2 flex-wrap">
            {days.map((day, idx) => (
              <li
                key={idx}
                onClick={() => handleDaySelect(idx)}
                className={`border-2 border-[#292321] px-3 py-1 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#292321] hover:text-white ${
                  selectedDay === idx ? "bg-[#292321] text-white shadow-md" : ""
                }`}
              >
                {day}
              </li>
            ))}
          </ul>
        </div>

        {/* Editable Timetable Table */}
        <h2 className="text-3xl font-bold text-[#292321]">
          {classes.find(c => c._id === selectedClass)?.className} - {days[selectedDay]}
        </h2>
        <table className="w-full border-collapse border border-[#292321]">
          <thead>
            <tr>
              <th className="border border-[#292321] p-2 bg-[#292321] text-white">Time</th>
              <th className="border border-[#292321] p-2 bg-[#292321] text-white">Subject</th>
              <th className="border border-[#292321] p-2 bg-[#292321] text-white">Teacher</th>
              <th className="border border-[#292321] p-2 bg-[#292321] text-white">Room</th>
            </tr>
          </thead>
          <tbody>
            {getFullDayTimetable().map((entry, idx) => (
              <tr key={idx} className="hover:bg-[#f0ebe4] transition duration-200">
                <td className="border border-[#292321] p-2">{entry.time}</td>
                <td className="border border-[#292321] p-2">
                  <input
                    value={entry.subject}
                    onChange={(e) => handleInputChange(idx, "subject", e.target.value)}
                    className="w-full border border-gray-300 p-1 rounded focus:ring-1 focus:ring-[#292321]"
                  />
                </td>
                <td className="border border-[#292321] p-2">
                  <input
                    value={entry.teacher}
                    onChange={(e) => handleInputChange(idx, "teacher", e.target.value)}
                    className="w-full border border-gray-300 p-1 rounded focus:ring-1 focus:ring-[#292321]"
                  />
                </td>
                <td className="border border-[#292321] p-2">
                  <input
                    value={entry.room}
                    onChange={(e) => handleInputChange(idx, "room", e.target.value)}
                    className="w-full border border-gray-300 p-1 rounded focus:ring-1 focus:ring-[#292321]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={saveTimetable}
            className="bg-[#292321] text-white py-2 px-4 rounded-md hover:bg-[#424141] transition duration-200"
          >
            Save Timetable
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
